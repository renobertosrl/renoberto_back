import { Router } from 'express';
import Project from '../models/Project.js';
import cloudinary from '../config/cloudinary.js';
import { auth } from '../middleware/auth.js';
import { toClient, extractPublicId } from '../utils.js';

const router = Router();

const collectUrls = (p) =>
  [p.cover, ...(p.images || []), p.beforeAfter?.before, p.beforeAfter?.after].filter(Boolean);

const cleanupCloudinary = (urls) => {
  const ids = [...new Set(urls.map(extractPublicId).filter(Boolean))];
  if (ids.length) cloudinary.api.delete_resources(ids).catch(err => console.warn('Cloudinary cleanup:', err.message));
};

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects.map(toClient));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const p = await Project.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Projet introuvable' });
    res.json(toClient(p));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

const handleProjectError = (e, res) => {
  if (e.code === 11000 && e.keyPattern?.slug) {
    return res.status(400).json({ message: 'Un projet avec ce titre existe déjà. Modifiez le titre.' });
  }
  res.status(400).json({ message: e.message });
};

router.post('/', auth, async (req, res) => {
  try {
    const p = await Project.create(req.body);
    res.status(201).json(toClient(p));
  } catch (e) { handleProjectError(e, res); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const old = await Project.findById(req.params.id);
    if (!old) return res.status(404).json({ message: 'Projet introuvable' });

    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    const newUrls = new Set(collectUrls(updated));
    const removed = collectUrls(old).filter(url => !newUrls.has(url));
    if (removed.length) cleanupCloudinary(removed);

    res.json(toClient(updated));
  } catch (e) { handleProjectError(e, res); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const p = await Project.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Projet introuvable' });
    cleanupCloudinary(collectUrls(p));
    await p.deleteOne();
    res.json({ success: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/:id/view', async (req, res) => {
  try {
    const p = await Project.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
    res.json({ views: p?.views ?? 0 });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
