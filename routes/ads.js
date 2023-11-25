const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import koneksi database
const adminLogin = require('../verify/adminLogin');


// Endpoint untuk mendapatkan data dari database
router.post('/create',adminLogin, async (req, res) => {
    try {
      const tokenHeaderKey = "admin-token";
      const data =JSON.parse(req.headers[tokenHeaderKey]);
      const { adsName, content } = req.body;
      console.log(data)
      const admin_id = data.id;
      if (admin_id) {
        const query = 'INSERT INTO ads (ads_name, content, admin_id, status) VALUES ($1, $2, $3, $4) RETURNING id';
        const article = await pool.query(query, [adsName, content, admin_id, false]);
        const insertedRow = article.rows[0]; // Mendapatkan baris pertama (dalam hal ini, satu baris saja)
        const newArticleId = insertedRow; // Mendapatkan nilai ID dari baris yang baru saja dimasukkan
        console.log(newArticleId);
        res.status(201).json(insertedRow);
      }else{
        res.status(500).json({ error: 'artikel gagal dibuat' });
      }
  
    } catch (error) {
      console.error('Error saat mendaftar', error);
      res.status(500).json({ error: 'ads gagal dibuat' });
    }
  });


  router.delete('/remove/',adminLogin, async (req, res) => {
    try {
      console.log('remove ads')
      const tokenHeaderKey = "admin-token";
      const { id } = req.body;
      console.log(id)
      const data =JSON.parse(req.headers[tokenHeaderKey]);
      const admin_id = data.id
      const queryId = 'SELECT * FROM ads WHERE id = $1';
      const { rows } = await pool.query(queryId, [id]);
      console.log(rows[0])
      const adminId = rows[0].admin_id
   

     
  
      if (admin_id == adminId) {

        
        const deleteTagsQuery = 'DELETE FROM ads_tags WHERE ads_id = $1';
        await pool.query(deleteTagsQuery, [id]);
  
        // Setelah menghapus data terkait dari 'article_tags', baru hapus artikel dari 'articles_draft'
        const deleteAdsQuery = 'DELETE FROM ads WHERE id = $1';
        await pool.query(deleteAdsQuery, [id]);
    
        res.status(201).json({ message: 'article berhasil dihapus' });
        
      }else{
        res.status(500).json({ error: 'ads gagal dibuat' });
      }
    } catch (error) {
      console.error('Error saat mendaftar', error);
      res.status(500).json({ error: 'ads gagal dibuat' });
    }
  });


  router.put('/update/:id',adminLogin, async (req, res) => {
    try {
      console.log('update')
      const tokenHeaderKey = "admin-token";
      const { ads_name, content, id,url_image,status } = req.body;
      const data =JSON.parse(req.headers[tokenHeaderKey]);
      const admin_id = data.id
      const queryId = 'SELECT * FROM ads WHERE id = $1';
      const { rows } = await pool.query(queryId, [id]);
      const adminId = rows[0].admin_id
   

     
  
      if (admin_id == adminId) {

        if(req.params.id == 0){
          const query = 'UPDATE ads SET content = $1, ads_name = $2, url_image = $3 WHERE id = $4';
          await pool.query(query, [ content, ads_name, url_image, id]);
      
          res.status(201).json({ message: `sukses` });
        }

        if(req.params.id == 1){
          const query = 'UPDATE ads SET content = $1, url_image = $2 WHERE id = $3';
          await pool.query(query, [ content, url_image,  id]);
      
          res.status(201).json({ message: `sukses` });
        }

        if(req.params.id == 2){
          const query = 'UPDATE ads SET ads_name = $1 WHERE id = $2';
          await pool.query(query, [ ads_name,  id]);
      
          res.status(201).json({ message: `sukses` });
        }

        if(req.params.id == 3){
          const query = 'UPDATE ads SET status = $1 WHERE id = $2';
          await pool.query(query, [ status,  id]);
      
          res.status(201).json({ message: `sukses` });
        }

        
      }else{
        res.status(500).json({ error: 'ads gagal dibuat' });
      }
    } catch (error) {
      console.error('Error saat mendaftar', error);
      res.status(500).json({ error: 'ads gagal dibuat' });
    }
  });

  router.get('/getAdsbyAdmin', async (req, res) => {
    try {
      const tokenHeaderKey = "admin-token";
      const data =JSON.parse(req.headers[tokenHeaderKey]);
      console.log(data)
      const admin_id = data.id;
      if (admin_id) {
        const query = 'SELECT * FROM ads WHERE admin_id = $1';
        const { rows } = await pool.query(query, [admin_id])
        console.log(rows)
        res.status(201).json(rows);
      }else{
        res.status(500).json({ error: 'artikel gagal dimuat' });
      }
  
    } catch (error) {
      console.error('Error saat mendaftar', error);
      res.status(500).json({ error: 'artikel gagal dimuat' });
    }
  });

  router.get('/getads/:id', async (req, res) => {
    try {
      const id = req.params.id; //akan diganti querry id di link
      const queryId = 'SELECT * FROM ads WHERE id = $1';
      const { rows } = await pool.query(queryId, [id]);
      console.log(rows[0])
    
      res.status(201).json(rows[0]);
    }catch(err){
      console.log(err)
    }
    
    });
  
  router.post('/initializeTag',adminLogin, async (req, res) => {
    try {
      const { ads_id,tag_id } = req.body;
      const tokenHeaderKey = 'admin-token'
      const data =JSON.parse(req.headers[tokenHeaderKey]);
      const admin_id = data.id
      const queryId = 'SELECT * FROM ads WHERE id = $1';
      const { rows } = await pool.query(queryId, [ads_id]);
      const adminId = rows[0].admin_id
      
  
      if (admin_id == adminId) {
        const query = 'INSERT INTO ads_tags (ads_id, tag_id) VALUES ($1, $2)';
        await pool.query(query, [ads_id,tag_id]);
    
        res.status(201).json({ message: 'Tag di tandai' });
      }
    } catch (error) {
      console.error('Error saat mendaftar', error);
      res.status(500).json({ error: 'tag gagal di tandai' });
    }
  });


  router.post('/removeTag',adminLogin, async (req, res) => {
    try {
      const { ads_id,tag_id } = req.body;
      const tokenHeaderKey = 'admin-token'
      const data =JSON.parse(req.headers[tokenHeaderKey]);
      const admin_id = data.id
      const queryId = 'SELECT * FROM ads WHERE id = $1';
      const { rows } = await pool.query(queryId, [ads_id]);
      const adminId = rows[0].admin_id
      
  
      if (admin_id == adminId) {
        const query = 'DELETE FROM ads_tags WHERE ads_id = $1 AND tag_id = $2';
        await pool.query(query, [ads_id,tag_id]);
    
        res.status(201).json({ message: 'Tag di tandai' });
      }
    } catch (error) {
      console.error('Error saat mendaftar', error);
      res.status(500).json({ error: 'tag gagal di tandai' });
    }
  });

  router.get('/alltags', async (req, res) => {
    try {
      const queryId = 'SELECT * FROM tags';
      const { rows } = await pool.query(queryId);
      console.log('tag')
      res.status(201).json(rows);
    }catch(err){
      console.log('gagal')
      console.log(err)
    }
    
    });

    router.get('/adstags/:id', async (req, res) => {
      const id = req.params.id
      try {
        const queryId = 'SELECT tags.id, tags.name FROM ads_tags inner join tags on ads_tags.tag_id = tags.id where ads_tags.ads_id = $1';
        const { rows } = await pool.query(queryId,[id]);
        console.log('tag')
        res.status(201).json(rows);
      }catch(err){
        console.log('gagal')
        console.log(err)
      }
      
      });

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
            console.log('tags',rows[0]);
    
            const tagIds = rows.map(row => row.tag_id);
            
            const sql3 = `
                SELECT ads_id FROM ads_tags
                WHERE tag_id = ANY($1)
            `;
            const sql =  `select ads_tags.ads_id from ads_tags inner join ads on ads_tags.ads_id = ads.id where ads_tags.tag_id = ANY($1) and ads.status = true `
           
            const { rows: rows2 } = await pool.query(sql, [tagIds]);
            console.log('ads',rows2);

            
            
            
            console.log(rows2.length)
    
           
    
            res.status(201).json(rows2);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Terjadi kesalahan dalam pengambilan data.' });
        }
    });
    


    module.exports = router;