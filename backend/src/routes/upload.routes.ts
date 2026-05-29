import { Router } from 'express';
import multer from 'multer';
import { asyncHandler } from '../middleware/errorHandler';
import { protect } from '../middleware/auth';
import { uploadLimiter } from '../middleware/rateLimiter';
import cloudinary from '../config/cloudinary';
import { AuthRequest } from '../middleware/auth';

const router = Router();
router.use(protect, uploadLimiter);

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    cb(null, allowed.includes(file.mimetype));
  },
});

router.post('/image', upload.single('image'), asyncHandler(async (req: AuthRequest, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file provided.' });

  const folder = req.body.folder || 'general';
  const b64 = Buffer.from(req.file.buffer).toString('base64');
  const dataURI = `data:${req.file.mimetype};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: `iitram-alumni/${folder}`,
    transformation: folder === 'avatar' ? [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }] : undefined,
  });

  res.json({ success: true, url: result.secure_url, publicId: result.public_id });
}));

router.post('/document', upload.single('document'), asyncHandler(async (req: AuthRequest, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file provided.' });

  const b64 = Buffer.from(req.file.buffer).toString('base64');
  const dataURI = `data:${req.file.mimetype};base64,${b64}`;

  const result = await cloudinary.uploader.upload(dataURI, {
    folder: 'iitram-alumni/documents',
    resource_type: 'raw',
  });

  res.json({ success: true, url: result.secure_url, publicId: result.public_id });
}));

router.delete('/:publicId', asyncHandler(async (req: AuthRequest, res) => {
  const publicId = decodeURIComponent(req.params.publicId);
  await cloudinary.uploader.destroy(publicId);
  res.json({ success: true, message: 'File deleted.' });
}));

export default router;
