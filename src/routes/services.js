import { Router } from 'express';
import Service from '../models/Service.js';
import { auth } from '../middleware/auth.js';
import { toClient } from '../utils.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    res.json((await Service.find().sort({ order: 1 })).map(toClient));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const count = await Service.countDocuments();
    const item = await Service.create({ ...req.body, order: count });
    res.status(201).json(toClient(item));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Service introuvable' });
    res.json(toClient(item));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
