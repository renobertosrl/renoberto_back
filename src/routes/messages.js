import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Message from '../models/Message.js';
import { auth } from '../middleware/auth.js';
import { toClient } from '../utils.js';
import { sendContactNotification } from '../mailer.js';

const router = Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: 'Trop de messages envoyés. Réessayez dans une heure.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Public — from the contact form
router.post('/', contactLimiter, async (req, res) => {
  try {
    const name  = req.body.name?.trim().slice(0, 100);
    const email = req.body.email?.trim().toLowerCase().slice(0, 200);
    const phone = req.body.phone?.trim().slice(0, 30) || undefined;
    const subject = req.body.subject?.trim().slice(0, 200) || undefined;
    const body  = req.body.body?.trim().slice(0, 5000);

    if (!name) return res.status(400).json({ message: 'Nom requis' });
    if (!email || !EMAIL_RE.test(email)) return res.status(400).json({ message: 'Email invalide' });
    if (!body) return res.status(400).json({ message: 'Message requis' });

    const msg = await Message.create({ name, email, phone, subject, body });
    sendContactNotification(msg).catch(err => console.error('[mailer]', err.message));
    res.status(201).json(toClient(msg));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

// Admin only
router.get('/', auth, async (req, res) => {
  try {
    res.json((await Message.find().sort({ createdAt: -1 })).map(toClient));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!msg) return res.status(404).json({ message: 'Message introuvable' });
    res.json(toClient(msg));
  } catch (e) { res.status(400).json({ message: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

export default router;
