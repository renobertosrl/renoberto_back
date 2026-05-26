import { Router } from 'express';
import Category from '../models/Category.js';
import Project  from '../models/Project.js';
import { auth } from '../middleware/auth.js';
import { toCat } from '../utils.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    res.json((await Category.find()).map(toCat));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { id, name } = req.body;
    if (!id || !name) return res.status(400).json({ message: 'id et name requis' });
    const cat = await Category.create({ _id: id, name });
    res.status(201).json(toCat(cat));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!cat) return res.status(404).json({ message: 'Catégorie introuvable' });
    res.json(toCat(cat));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const inUse = await Project.exists({ category: req.params.id });
    if (inUse) return res.status(400).json({ message: 'Des projets utilisent cette catégorie' });
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
