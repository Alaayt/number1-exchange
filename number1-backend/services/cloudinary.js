// services/cloudinary.js
// ═══════════════════════════════════════════════
// إعداد Cloudinary لرفع صور الإيصالات
// ═══════════════════════════════════════════════
const cloudinary  = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

// ── إعداد الاتصال ──────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// ── إعداد مكان الحفظ ───────────────────────────
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'number1/receipts',   // مجلد في Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1200, crop: 'limit' },     // ضغط الحجم
      { quality: 'auto' }
    ],
  },
})

// ── فلتر الملفات ───────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('نوع الملف غير مسموح — يُقبل فقط: JPG, PNG, WEBP'), false)
  }
}

// ── إعداد Multer ───────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB حد أقصى
  },
})

module.exports = { upload, cloudinary }