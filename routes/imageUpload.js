const express = require('express');
const multer = require('multer');
const path = require('path');
const generateToken = require('./auth');
const verifyToken = require('../verify/writerLogin');
const verifyTokenAdmin = require('../verify/adminLogin');
const pool = require('../db'); // Import koneksi database
const bcrypt = require('bcrypt');

const router = express.Router();

// Konfigurasi Multer untuk menangani pengunggahan gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Menyimpan gambar di dalam folder "uploads"
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/upload',verifyToken,  upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File gambar diperlukan.' });
    }

    const imageName = req.file.filename;
    const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;

    const insertQuery = 'INSERT INTO gambar (name_image, url_image) VALUES ($1, $2) RETURNING id, name_image, url_image';
    const result = await pool.query(insertQuery, [imageName, imageUrl]);


    // Mengirim data gambar yang baru saja dimasukkan sebagai respons
    return res.status(201).json({imageUrl});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan gambar.' });
  }
});

// ...

// Endpoint API untuk menghapus gambar berdasarkan nama file
router.delete('/delete-imageprofile/:imageUrl', verifyToken, async (req, res) => {
  try {
    const imageUrl= req.params.imageUrl;
    const imagePath = path.join(__dirname, 'uploads', imageName);
    const tokenHeaderKey = 'jwt-token'
    const data =JSON.parse(req.headers[tokenHeaderKey]);
    const writer_id = data.id

    // Periksa apakah file gambar ada
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // Hapus file gambar dari sistem file
      console.log(`Gambar ${imageName} telah dihapus.`);

      // Hapus data gambar dari database (sesuaikan dengan struktur tabel Anda)
      const deleteQuery = 'DELETE FROM profile_images WHERE image_url = $1 AND writer_id = $2';
      await pool.query(deleteQuery, [imageUrl,writer_id]);

      return res.status(204).send();
    } else {
      console.log(`Gambar ${imageName} tidak ditemukan.`);
      return res.status(404).json({ message: 'Gambar tidak ditemukan.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat menghapus gambar.' });
  }
});

// ...



router.post('/upload/writer',verifyToken,  upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File gambar diperlukan.' });
    }
    const tokenHeaderKey = 'jwt-token'
    const data =JSON.parse(req.headers[tokenHeaderKey]);
    const writer_id = data.id
    const image_name = req.file.filename
    const imageUrl = `http://localhost:3000/uploads/${image_name}`;

    const insertQuery = 'INSERT INTO profile_images (writer_id, image_url,image_name) VALUES ($1, $2, $3)' ;
    const result = await pool.query(insertQuery, [writer_id, imageUrl, image_name]);


    // Mengirim data gambar yang baru saja dimasukkan sebagai respons
    return res.status(201).json({result});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan gambar.' });
  }
});

router.get('/get-image/writer',verifyToken, async (req, res) => {
  try {
    const tokenHeaderKey = 'jwt-token'
    const data =JSON.parse(req.headers[tokenHeaderKey]);
    const writer_id = data.id
    
    const querryId = 'SELECT image_url FROM profile_images WHERE writer_id = $1';
    const { rows } = await pool.query(querryId,[writer_id]);


    // Mengirim data gambar yang baru saja dimasukkan sebagai respons
    return res.status(201).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan gambar.' });
  }
});

router.get('/get-image', async (req, res) => {
  try {
    
    
    const querryId = 'SELECT * FROM gambar';
    const { rows } = await pool.query(querryId);


    // Mengirim data gambar yang baru saja dimasukkan sebagai respons
    return res.status(201).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan gambar.' });
  }
});



router.post('/upload/ads',verifyTokenAdmin,  upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File gambar diperlukan.' });
    }
    const tokenHeaderKey = 'admin-token'
    const data =JSON.parse(req.headers[tokenHeaderKey]);
    const admin_id = data.id
    const image_name = req.file.filename
    const imageUrl = `http://localhost:3000/uploads/${image_name}`;

    const insertQuery = 'INSERT INTO ads_image (admin_id, url_image,name_image) VALUES ($1, $2, $3) RETURNING id, admin_id, url_image,name_image' ;
    const {rows} = await pool.query(insertQuery, [admin_id, imageUrl, image_name]);

    
    // Mengirim data gambar yang baru saja dimasukkan sebagai respons
    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan gambar.' });
  }
});

router.get('/get-image/ads',verifyTokenAdmin, async (req, res) => {
  try {
    const tokenHeaderKey = 'admin-token'
    const data =JSON.parse(req.headers[tokenHeaderKey]);
    const admin_id = data.id
    
    const querryId = 'SELECT url_image FROM ads_image WHERE admin_id = $1';
    const { rows } = await pool.query(querryId,[admin_id]);


    // Mengirim data gambar yang baru saja dimasukkan sebagai respons
    return res.status(201).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan gambar.' });
  }
});

module.exports = router;
