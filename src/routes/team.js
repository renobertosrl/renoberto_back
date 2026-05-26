import { Router } from 'express';
import TeamMember from '../models/TeamMember.js';
import { auth } from '../middleware/auth.js';
import { toClient } from '../utils.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    res.json((await TeamMember.find().sort({ order: 1 })).map(toClient));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const count = await TeamMember.countDocuments();
    const item = await TeamMember.create({ ...req.body, order: count });
    res.status(201).json(toClient(item));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const item = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Membre introuvable' });
    res.json(toClient(item));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await TeamMember.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
