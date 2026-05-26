import { Router } from 'express';
import ProcessStep from '../models/ProcessStep.js';
import { auth } from '../middleware/auth.js';
import { toClient } from '../utils.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    res.json((await ProcessStep.find().sort({ order: 1 })).map(toClient));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PUT /reorder must come BEFORE /:id to avoid Express matching 'reorder' as an ID
router.put('/reorder', auth, async (req, res) => {
  try {
    const { ids } = req.body; // array of IDs in the new order
    await Promise.all(ids.map((id, index) =>
      ProcessStep.findByIdAndUpdate(id, { order: index })
    ));
    res.json({ success: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const count = await ProcessStep.countDocuments();
    const item = await ProcessStep.create({ ...req.body, order: count });
    res.status(201).json(toClient(item));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const item = await ProcessStep.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Étape introuvable' });
    res.json(toClient(item));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await ProcessStep.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
