// routes/homeRoutes.js
const express = require('express');
const router = express.Router();
const generateToken = require('./adminAuth');
const adminLogin = require('../verify/adminLogin');
const pool = require('../db'); // Import koneksi database
const bcrypt = require('bcrypt');

// Definisi route
router.get('/',adminLogin, (req, res) => {
  res.status(201).json({ message: 'token berhasil' });
});

router.get('/check', (req, res) => {
  const tokenHeaderKey = "admin-token";
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
    return res.status(401).json({ message: "error catch" });
  }
});


// Endpoint untuk mendapatkan data dari database
router.post('/register', async (req, res) => {
    try {
      const { nama, username, password } = req.body;
     
      
  
      const hashedPassword = await bcrypt.hash(password, 10); // Hash password
  
      const query = 'INSERT INTO Admin (nama, username, password) VALUES ($1, $2, $3)';
      
      await pool.query(query, [nama, username, hashedPassword]);


      const query2 = 'SELECT * FROM Admin WHERE username = $1';
      const { rows } = await pool.query(query2, [username]);
  
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Username atau password salah' });
      }
  
      const user = rows[0];
      console.log(user)
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Username atau password salah' });
      }
      const token = generateToken(user.id);
      // localStorage.setItem('accessToken', data.token);
      const age = 1000*3600*24
      res.cookie('token', token, { httpOnly: true, maxAge: age });
      return res.status(401).json({ 'token': token, 'id': user.id });
      
  
      res.status(201).json({ message: 'Pengguna terdaftar' });
    } catch (error) {
      console.error('Error saat mendaftar', error);
      res.status(500).json({ error: req.body });
    }
  });


  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
  
      const query = 'SELECT * FROM Admin WHERE username = $1';
      const { rows } = await pool.query(query, [username]);
  
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Username atau password salah' });
      }
  
      const user = rows[0];
      console.log(user)
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Username atau password salah' });
      }
      const token = generateToken(user.id);
      // localStorage.setItem('accessToken', data.token);
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

// Ekspor router
module.exports = router;
