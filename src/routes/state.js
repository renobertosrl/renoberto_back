import { Router } from 'express';
import Project    from '../models/Project.js';
import Category   from '../models/Category.js';
import Service    from '../models/Service.js';
import Testimonial from '../models/Testimonial.js';
import TeamMember from '../models/TeamMember.js';
import ProcessStep from '../models/ProcessStep.js';
import Content    from '../models/Content.js';
import { toClient, toCat } from '../utils.js';

const router = Router();

// Single request for all public data — used on initial app load
router.get('/', async (req, res) => {
  try {
    const [projects, categories, services, testimonials, team, process, content] = await Promise.all([
      Project.find().sort({ createdAt: -1 }),
      Category.find(),
      Service.find().sort({ order: 1 }),
      Testimonial.find().sort({ createdAt: -1 }),
      TeamMember.find().sort({ order: 1 }),
      ProcessStep.find().sort({ order: 1 }),
      Content.findById('main'),
    ]);

    res.json({
      projects:     projects.map(toClient),
      categories:   categories.map(toCat),
      services:     services.map(toClient),
      testimonials: testimonials.map(toClient),
      team:         team.map(toClient),
      process:      process.map(toClient),
      content:      content
        ? { heroImage: content.heroImage, about: content.about, contact: content.contact, stats: content.stats || [] }
        : { heroImage: null, about: {}, contact: {}, stats: [] },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
