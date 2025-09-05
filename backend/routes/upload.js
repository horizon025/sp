const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post("/", upload.single("image"), (req, res) => {
  res.json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;
