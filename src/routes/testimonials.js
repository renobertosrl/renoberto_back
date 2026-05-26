import { Router } from 'express';
import Testimonial from '../models/Testimonial.js';
import { auth } from '../middleware/auth.js';
import { toClient } from '../utils.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    res.json((await Testimonial.find().sort({ createdAt: -1 })).map(toClient));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    res.status(201).json(toClient(await Testimonial.create(req.body)));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Témoignage introuvable' });
    res.json(toClient(item));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
