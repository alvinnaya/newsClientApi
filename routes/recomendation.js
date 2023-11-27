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
        WITH articleTags AS (
          SELECT tag_id
          FROM article_tags
          WHERE article_id = $1
        )
        
        SELECT
          a.article_id,
          COUNT(article_tags.article_id) AS tag_count
          
        FROM
          articleTags
         JOIN article_tags ON article_tags.tag_id = articleTags.tag_id
         right JOIN articles a ON article_tags.article_id = a.article_id
        WHERE
          a.article_id != $1
        GROUP BY
          a.title,
          a.article_id,
          article_tags.article_id
        ORDER BY 
          tag_count DESC;
        
        `;

        const { rows } = await pool.query(query, [id]);
        console.log('rows',rows);

        const mostData = rows.map(item => item.article_id);

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
      console.log(ids)
      const queryIds = `SELECT *
      FROM articles
      WHERE article_id = ANY($1)
      ORDER BY array_position($1,article_id);`;
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
