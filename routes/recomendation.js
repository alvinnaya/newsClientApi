const express = require('express');
const router = express.Router();
const generateToken = require('./auth');
const verifyToken = require('../verify/writerLogin');
const pool = require('../db'); // Import koneksi database
const mostDataFreq = require('../controllers/getMostFrequentlyData');


router.get('/getRecomendation/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = `
            SELECT article_tags.article_id, articles.article_id, article_tags.tag_id, tags.name 
            FROM article_tags 
            INNER JOIN articles ON articles.article_id = article_tags.article_id 
            INNER JOIN tags ON article_tags.tag_id = tags.id 
            WHERE articles.article_id = $1
        `;

        const { rows } = await pool.query(query, [id]);
        console.log(rows[0]);

        const tagIds = rows.map(row => row.tag_id);
        
        const sql = `
            SELECT * FROM article_tags
            WHERE tag_id = ANY($1)
        `;

        const { rows: rows2 } = await pool.query(sql, [tagIds]);
        console.log(rows2);

        const filteredRows2 = rows2.filter(item => item.article_id !== parseInt(id));
        console.log(filteredRows2);

        const mostData = await mostDataFreq.getMostFreqData(filteredRows2, 'article_id');
        console.log(mostData);

        res.status(201).json(mostData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Terjadi kesalahan dalam pengambilan data.' });
    }
});



router.get('/getArticles', async (req, res) => {
    try {
      const ids = req.query.ids.split(',').map(Number); // Mengambil dan konversi array ID dari query parameter "ids" dalam URL
      const queryIds = 'SELECT * FROM articles WHERE article_id = ANY($1)';
      const { rows } = await pool.query(queryIds, [ids]);
      console.log('Artikel yang ditemukan:', rows);


      const blogContents = rows.map(item => {
        const articleId = item.article_id;
        const title = item.title;
        const time = item.created_at;
    
        // Mengakses BlogContent dan menggabungkannya menjadi satu array
        const blogContent = item.content.BlogContent[0]
    
            // Menambahkan halaman dengan komponen ke hasil akhir
        
        return { articleId, title,time, blogContent };
    });
  console.log(rows[0])
      res.status(201).json(blogContents);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Terjadi kesalahan dalam mengambil artikel.' });
    }
  });
  
  


module.exports = router;
