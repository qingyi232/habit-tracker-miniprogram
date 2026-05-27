const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e6) + ext);
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.json({ code: -1, msg: '请选择文件' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ code: 0, data: { url, filename: req.file.filename } });
});

module.exports = router;
