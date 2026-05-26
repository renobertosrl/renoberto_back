import { Router } from 'express';
import Content from '../models/Content.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const content = await Content.findById('main');
    res.json(content
      ? { about: content.about, contact: content.contact }
      : { about: {}, contact: {} }
    );
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/about', auth, async (req, res) => {
  try {
    const content = await Content.findByIdAndUpdate(
      'main',
      { $set: { about: req.body } },
      { new: true, upsert: true }
    );
    res.json({ about: content.about });
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/contact', auth, async (req, res) => {
  try {
    const content = await Content.findByIdAndUpdate(
      'main',
      { $set: { contact: req.body } },
      { new: true, upsert: true }
    );
    res.json({ contact: content.contact });
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/hero', auth, async (req, res) => {
  try {
    const { heroImage } = req.body;
    const content = await Content.findByIdAndUpdate(
      'main',
      { $set: { heroImage } },
      { new: true, upsert: true }
    );
    res.json({ heroImage: content.heroImage });
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/stats', auth, async (req, res) => {
  try {
    const { stats } = req.body;
    const content = await Content.findByIdAndUpdate(
      'main',
      { $set: { stats } },
      { new: true, upsert: true }
    );
    res.json({ stats: content.stats });
  } catch (e) { res.status(400).json({ message: e.message }); }
});

export default router;
