// routes/homeRoutes.js
const express = require('express');
const router = express.Router();
const generateToken = require('./auth');
const verifyToken = require('../verify/writerLogin');
const jwt = require('jsonwebtoken');
const verifyTokenAdmin = require('../verify/adminLogin');

const pool = require('../db'); // Import koneksi database
const bcrypt = require('bcrypt');

// Definisi route
router.get('/',verifyToken, (req, res) => {
  res.status(201).json({ message: 'token berhasil' });
});


router.get('/check', (req, res) => {
  const tokenHeaderKey = "jwt-token";
  const data =JSON.parse(req.headers[tokenHeaderKey]);
  console.log(data)
  console.log(data.token)
  try {
    console.log('1')
    const verified = jwt.verify(data.token, "secretKey");
    console.log('2')
    console.log(verified)
    console.log(verified.id)
    console.log(data.id)
    if (verified && verified.id == data.id) {
      return res
        .status(200)
        .json({ message: "success" });
    } else {
      // Access Denied
      return res.status(401).json({ message: "error" });
    }
  } catch (error) {
    // Access Denied
    console.log(error)
    return res.status(401).json({ message: "error catch" });
  }
});



// Endpoint untuk mendapatkan data dari database
router.post('/register',verifyTokenAdmin, async (req, res) => {
    try {
      const { nama, username, password } = req.body;
      const tokenHeaderKey = 'admin-token';
      const data =JSON.parse(req.headers[tokenHeaderKey]);
      console.log(data)
      const admin_id = data.id
  
      const hashedPassword = await bcrypt.hash(password, 10); // Hash password
  
      const query = 'INSERT INTO writer (nama, username, password, admin_id) VALUES ($1, $2, $3, $4)';
      await pool.query(query, [nama, username, hashedPassword, admin_id]);
  
      res.status(201).json({ message: 'Pengguna terdaftar' });
    } catch (error) {
      console.error('Error saat mendaftar', error);
      res.status(500).json({ error: 'Terjadi kesalahan' });
    }
  });


  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log(req.body)
  
      const query = 'SELECT * FROM writer WHERE username = $1';
      const { rows } = await pool.query(query, [username]);
  
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Username atau password salah' });
        console.log(req.body)
      }
  
      const user = rows[0];
      console.log(user)
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Username atau password salah' });
        console.log(req.body)
        console.log('password salah')
      
      }
      const token = generateToken(user.id);
      console.log(token);
      const age = 1000*3600*24
      res.cookie('token', token, { httpOnly: true, maxAge: age });
      return res.status(401).json({ 'token': token, 'id': user.id });
      
      // Berhasil masuk, berikan token atau sesi
      // ...
    } catch (error) {
      console.error('Error saat masuk', error);
      res.status(500).json({ error: 'Terjadi kesalahan' });
    }
  });

  router.get('/profile/',verifyToken, async (req, res) => {
    try {
      const tokenHeaderKey = 'jwt-token';
      const data =JSON.parse(req.headers[tokenHeaderKey]);
      const writer_id = data.id
      console.log(writer_id)
      const insertQuery = 'SELECT * FROM writer WHERE id = $1' ;
      const {rows} = await pool.query(insertQuery, [writer_id]);
      const profile = rows[0]
  
      // Mengirim data gambar yang baru saja dimasukkan sebagai respons
      console.log('sukses')
      console.log(profile)
      return res.status(201).json({profile});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan gambar.' });
    }
  });

  router.put('/profile/changeimage',verifyToken, async (req, res) => {
    try {
      const tokenHeaderKey = 'jwt-token';
      const data =JSON.parse(req.headers[tokenHeaderKey]);
      const writer_id = data.id
      console.log(writer_id)
      const {currentImage} = req.body;
      const insertQuery = 'UPDATE writer SET profile_image = $2 WHERE id = $1' ;
      const result = await pool.query(insertQuery, [writer_id, currentImage]);
  
  
      // Mengirim data gambar yang baru saja dimasukkan sebagai respons
      console.log('sukses')
      return res.status(201).json({currentImage});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan gambar.' });
    }
  });

  router.put('/profile/changeNama',verifyToken, async (req, res) => {
    try {
      const tokenHeaderKey = 'jwt-token';
      const data =JSON.parse(req.headers[tokenHeaderKey]);
      const writer_id = data.id
      console.log(writer_id)
      const {nama} = req.body;
      const insertQuery = 'UPDATE writer SET nama = $2 WHERE id = $1' ;
      const result = await pool.query(insertQuery, [writer_id, nama]);
  
  
      // Mengirim data gambar yang baru saja dimasukkan sebagai respons
      console.log('sukses')
      return res.status(201).json({nama});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan gambar.' });
    }
  });


  router.get('/get-allprofile/',verifyTokenAdmin, async (req, res) => {
    try {
      const tokenHeaderKey = 'admin-token';
      const data =JSON.parse(req.headers[tokenHeaderKey]);
      console.log(data)
      const writer_id = data.id
      console.log(writer_id)
      const insertQuery = 'SELECT * FROM writer WHERE admin_id = $1' ;
      const {rows} = await pool.query(insertQuery, [writer_id]);
      const profile = rows
  
      // Mengirim data gambar yang baru saja dimasukkan sebagai respons
      console.log('sukses')
      console.log(profile)
      return res.status(201).json({profile});
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan gambar.' });
    }
  });

// Ekspor router
module.exports = router;
