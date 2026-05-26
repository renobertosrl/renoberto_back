import { Router } from 'express';
import multer from 'multer';
import { Readable } from 'stream';
import cloudinary from '../config/cloudinary.js';
import { auth } from '../middleware/auth.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

router.post('/', auth, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Aucun fichier fourni' });
  if (!ALLOWED_MIME.includes(req.file.mimetype))
    return res.status(400).json({ message: 'Format non supporté. Utilisez JPG, PNG ou WEBP.' });
  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'renoberto', resource_type: 'image', quality: 'auto', fetch_format: 'auto' },
        (err, result) => err ? reject(err) : resolve(result)
      );
      Readable.from(req.file.buffer).pipe(stream);
    });
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
