const express = require('express');
const cors = require('cors');
const multer = require('multer');
const dotenv = require('dotenv');
const ImageKit = require('imagekit');
const path = require('path');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Multer (local rasmni vaqtincha saqlash uchun)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ImageKit sozlash
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// API: upload image
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;

    // Fayl nomini tozalash (masalan: 1751781917587-1000008524_ZgxEAM8eg.jpg → 1751781917587-1000008524_ZgxEAM8eg.jpg)
    const cleanFileName = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '-');

    const result = await imagekit.upload({
      file: file.buffer,
      fileName: cleanFileName,
      folder: "products",
    });

    res.status(200).json({ url: result.url });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }
});


// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
