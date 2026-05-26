import { Router } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Trop de tentatives. Réessayez dans 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

router.post('/login', loginLimiter, async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email et mot de passe requis' });

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Identifiants incorrects' });

    res.json({
      token: signToken(user._id),
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/me', auth, (req, res) => {
  res.json({ id: req.user._id, email: req.user.email, name: req.user.name, role: req.user.role });
});

router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 8)
      return res.status(400).json({ message: 'Le nouveau mot de passe doit faire au moins 8 caractères' });
    const user = await User.findById(req.user._id);
    if (!(await user.comparePassword(currentPassword)))
      return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Mot de passe mis à jour' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
