// routes/homeRoutes.js
const express = require('express');
const router = express.Router();
const generateToken = require('./auth');
const WriterLogin = require('../verify/writerLogin');
const pool = require('../db'); // Import koneksi database
const bcrypt = require('bcrypt');

// Definisi route
router.get('/',WriterLogin, (req, res) => {
  res.status(201).json({ message: 'token berhasil' });
});

// Endpoint untuk mendapatkan data dari database


  router.post('/createTag', async (req, res) => {
    try {
      const {Tagname } = req.body;
  z
      const query = 'INSERT INTO tags (name) VALUES ($1)';
      await pool.query(query, [Tagname]);
  
      res.status(201).json({ message: 'Tag dibuat' });
    } catch (error) {
      console.error('Error saat mendaftar', error);
      res.status(500).json({ error: 'Tag gagal dibuat' });
    }
  });

  router.post('/AddTag', async (req, res) => {
    try {
      const { articleId, TagID } = req.body;

      TagID.array.forEach(data => {
        const query = 'INSERT INTO article_tag (article_id,tag_id) VALUES ($1, $2,)';
        pool.query(query,[articleId,data], (err,result)=>{
          if (err) {
            console.error('Error inserting data:', err);
          } else {
            console.log('Data inserted:', result);
          }
        })
      });

      
  
      
      const { rows } = await pool.query(query, [articleId, TagID]);
  
      // if (rows.length === 0) {
      //   return res.status(401).json({ error: 'Username atau password salah' });
      // }
  
      
      console.log(rows)
  
     
    } catch (error) {
      console.error('Error saat masuk', error);
      res.status(500).json({ error: 'Terjadi kesalahan' });
    }
  });

// Ekspor router
module.exports = router;
