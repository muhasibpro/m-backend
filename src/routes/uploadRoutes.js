const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');

// Bitta rasm yuklash
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Fayl yuborilmadi" });
  const fileUrl = `https://muhasib.pro/uploads/${req.file.filename}`;
  res.json({ fileUrl, filename: req.file.filename });
});

module.exports = router;