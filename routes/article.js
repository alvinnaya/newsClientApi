// routes/homeRoutes.js
const express = require('express');
const router = express.Router();
const generateToken = require('./auth');
const verifyToken = require('../verify/writerLogin');
const pool = require('../db'); // Import koneksi database
const bcrypt = require('bcrypt');
const cheerio = require('cheerio');

// Definisi route
router.get('/getarticle/:id', async (req, res) => {
try {
  const id = req.params.id; //akan diganti querry id di link
  const queryId = 'SELECT * FROM articles_draft WHERE id = $1';
  const { rows } = await pool.query(queryId, [id]);
  console.log(rows[0])

  res.status(201).json(rows[0]);
}catch(err){
  console.log(err)
}

});

router.get('/getArticlePublish/:id', async (req, res) => {
  try {
    const id = req.params.id; //akan diganti querry id di link
    const queryId = 'SELECT * FROM articles WHERE article_id = $1';
    const { rows } = await pool.query(queryId, [id]);
    console.log('pengunjung',rows[0])
  
    res.status(201).json(rows[0]);
  }catch(err){
    console.log(err)
  }
  
  });



router.get('/getArticlePublishHeader/:id', async (req, res) => {
    try {
      const id = req.params.id; //akan diganti querry id di link
      const queryId = 'SELECT title,url_image,created_at,writer_id,Descrip FROM articles WHERE article_id = $1';
      const { rows } = await pool.query(queryId, [id]);
      console.log('pengunjung',rows[0])
    
      res.status(201).json(rows[0]);
    }catch(err){
      console.log(err)
    }
    
    });



router.get('/getArticlebyWriter',verifyToken, async (req, res) => {
  try {
    const tokenHeaderKey = "jwt-token";
    const data =JSON.parse(req.headers[tokenHeaderKey]);
    console.log(data)
    const writer_id = data.id;
    if (writer_id) {
      const query = 'SELECT * FROM articles_draft WHERE writer_id = $1';
      const { rows } = await pool.query(query, [writer_id])
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

router.get('/getallArticle', async(req, res)=>{


  try {
    const page = req.query.page || 1; // Halaman yang diminta
    const perPage = req.query.perPage || 10; // Jumlah item per halaman
    const offset = (page - 1) * perPage; 
    const queryIds = 'SELECT * FROM articles LIMIT $1 OFFSET $2';
    const { rows } = await pool.query(queryIds, [perPage, offset]);
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
})

router.get('/getpublishedArticlebyWriter',verifyToken, async (req, res) => {
  try {
    const tokenHeaderKey = "jwt-token";
    const data =JSON.parse(req.headers[tokenHeaderKey]);
    console.log(data)
    const writer_id = data.id;
    if (writer_id) {
      const query = 'SELECT article_id,title,url_image,created_at,writer_id,descrip FROM articles WHERE writer_id = $1';
      const { rows } = await pool.query(query, [writer_id])
      console.log(rows[0])
      res.status(201).json(rows);
    }else{
      res.status(500).json({ error: 'artikel gagal dimuat' });
    }

  } catch (error) {
    console.error('Error saat mendaftar', error);
    res.status(500).json({ error: 'artikel gagal dimuat' });
  }
});



// Endpoint untuk mendapatkan data dari database
router.post('/create',verifyToken, async (req, res) => {
    try {
      const tokenHeaderKey = "jwt-token";
      const data =JSON.parse(req.headers[tokenHeaderKey]);
      const { title, content } = req.body;
      console.log(data)
      const writer_id = data.id;
      if (writer_id) {
        const query = 'INSERT INTO articles_draft (title, content, writer_id) VALUES ($1, $2, $3) RETURNING id';
        const article = await pool.query(query, [title, content, writer_id]);
        
        const insertedRow = article.rows[0]; // Mendapatkan baris pertama (dalam hal ini, satu baris saja)
        const newArticleId = insertedRow.id; // Mendapatkan nilai ID dari baris yang baru saja dimasukkan
        console.log(newArticleId);
        // const query2 = 'INSERT INTO article_tags (article_id, tag_id) VALUES ($1, $2)';
        // await pool.query(query2, [newArticleId,10]);
        res.status(201).json(insertedRow);
      }else{
        res.status(500).json({ error: 'artikel gagal dibuat' });
      }
  
    } catch (error) {
      console.error('Error saat mendaftar', error);
      res.status(500).json({ error: 'artikel gagal dibuat' });
    }
  });

  router.put('/update',verifyToken, async (req, res) => {
    try {
      console.log('update')
      const tokenHeaderKey = "jwt-token";
      const { title, content, id, url_image, descrip } = req.body;
      const data =JSON.parse(req.headers[tokenHeaderKey]);
      const writer_id = data.id
      const queryId = 'SELECT * FROM articles_draft WHERE id = $1';
      const { rows } = await pool.query(queryId, [id]);
      const writerId = rows[0].writer_id
      const htmlText = `${title}`;
      // Load teks HTML ke Cheerio
      const $ = cheerio.load(htmlText);

      // Hapus tag HTML dan atributnya
      const plainText = $.text();

      // Menampilkan teks
      console.log(plainText);

      const d = cheerio.load(`${descrip}`);

      // Hapus tag HTML dan atributnya
      const allText = d.text();

      // Menampilkan teks
      console.log(allText);
  
      if (writer_id == writerId) {

        const query = 'UPDATE articles_draft SET title = $1, content = $2, writer_id = $3, url_image = $4, Descrip = $5 WHERE id = $6';
        await pool.query(query, [plainText, content, writerId,url_image, allText, id]);
    
        res.status(201).json({ message: `${plainText}` });
      }else{
        res.status(500).json({ error: 'artikel gagal dibuat' });
      }
    } catch (error) {
      console.error('Error saat mendaftar', error);
      res.status(500).json({ error: 'artikel gagal dibuat' });
    }
  });



  router.delete('/delete',verifyToken, async (req, res) => {
    try {
      const tokenHeaderKey = "jwt-token";
      const { id } = req.body;
      const data =JSON.parse(req.headers[tokenHeaderKey]);
      const writer_id = data.id
      console.log('delete',writer_id)
      console.log('delete article',id)
      const queryId = 'SELECT * FROM articles_draft WHERE id = $1';
      const { rows } = await pool.query(queryId, [id]);
      console.log('delete article',id)
      const writerId = rows[0].writer_id;
      console.log('writerId',writerId)
      
  
      if (writer_id == writerId) {

        const deleteTagsQuery = 'DELETE FROM article_tags WHERE article_id = $1';
        await pool.query(deleteTagsQuery, [id]);
  
        // Setelah menghapus data terkait dari 'article_tags', baru hapus artikel dari 'articles_draft'
        const deleteArticleQuery = 'DELETE FROM articles_draft WHERE id = $1';
        await pool.query(deleteArticleQuery, [id]);
    
        res.status(201).json({ message: 'article berhasil dihapus' });
      }else{
        res.status(500).json({ error: 'artikel gagal dihapus' });
      }
    } catch (error) {
      console.error('Error saat mendaftar', error);
      res.status(500).json({ error: 'artikel gagal dihapus' });
    }
  });



  router.post('/initializeTag',verifyToken, async (req, res) => {
    try {
      const { article_id,tag_id } = req.body;
      const tokenHeaderKey = 'jwt-token'
      const data =JSON.parse(req.headers[tokenHeaderKey]);
      const writer_id = data.id
      const queryId = 'SELECT * FROM articles_draft WHERE id = $1';
      const { rows } = await pool.query(queryId, [article_id]);
      const writerId = rows[0].writer_id
      
  
      if (writer_id == writerId) {
        const query = 'INSERT INTO article_tags (article_id, tag_id) VALUES ($1, $2)';
        await pool.query(query, [article_id,tag_id]);
    
        res.status(201).json({ message: 'Tag di tandai' });
      }
    } catch (error) {
      console.error('Error saat mendaftar', error);
      res.status(500).json({ error: 'tag gagal di tandai' });
    }
  });

  
  router.post('/removeTag', verifyToken, async (req, res) => {
    try {
      const { article_id, tags_id } = req.body;
      const tokenHeaderKey = 'jwt-token';
      const data = JSON.parse(req.headers[tokenHeaderKey]);
      const writer_id = data.id;
  
      // Periksa apakah penulis artikel adalah pemilik artikel
      const queryId = 'SELECT writer_id FROM articles_draft WHERE id = $1';
      const { rows } = await pool.query(queryId, [article_id]);
      const writerId = rows[0].writer_id;
  
      if (writer_id == writerId && tags_id != 10) {
        
        // Hapus tag dari artikel
        const deleteQuery = 'DELETE FROM article_tags WHERE article_id = $1 AND tag_id = $2';
        await pool.query(deleteQuery, [article_id, tags_id]);
  
        res.status(200).json({ message: `Tag dihapus dari artikel id: ${article_id}, tag: ${tags_id} body: ${req.body}` });
      } else {
        res.status(403).json({ error: 'Anda tidak memiliki izin untuk menghapus tag dari artikel ini' });
      }
    } catch (error) {
      console.error('Error saat menghapus tag', error);
      res.status(500).json({ error: 'Tag gagal dihapus' });
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


    router.get('/articletags/:id', async (req, res) => {
      const id = req.params.id
      try {
        const queryId = 'SELECT tags.id, tags.name FROM article_tags inner join tags on article_tags.tag_id = tags.id where article_tags.article_id = $1';
        const { rows } = await pool.query(queryId,[id]);
        console.log('tag')
        res.status(201).json(rows);
      }catch(err){
        console.log('gagal')
        console.log(err)
      }
      
      });



    
    router.post('/createTag', verifyToken, async (req, res) => {
      try {
        const Tagname = req.body.inputValue;
        console.log(Tagname);
    
        // Periksa apakah nama tag sudah ada dalam database
        const checkQuery = 'SELECT id FROM tags WHERE name = $1';
        const { rows } = await pool.query(checkQuery, [Tagname]);
    
        if (rows.length > 0) {
          // Jika nama tag sudah ada, kirim respons dengan pesan kesalahan
          res.status(400).json({ error: 'Nama tag sudah ada dalam database' });
        } else {
          // Jika nama tag belum ada, maka masukkan data tag baru ke dalam database
          const insertQuery = 'INSERT INTO tags (name) VALUES ($1) RETURNING id, name';
          const result = await pool.query(insertQuery, [Tagname]);
    
          // Mengambil data tag yang baru saja dibuat dari hasil query
          const createdTag = result.rows[0];
    
          // Mengirim data tag yang baru saja dibuat sebagai respons
          res.status(201).json({ message: 'Tag dibuat', tag: createdTag });
        }
      } catch (error) {
        console.error('Error saat mendaftar', error);
        res.status(500).json({ error: 'Tag gagal dibuat' });
      }
    });
    

    router.post('/publish',verifyToken, async (req, res) => {
      try {
        const tokenHeaderKey = "jwt-token";
        const { id } = req.body;
        const data =JSON.parse(req.headers[tokenHeaderKey]);
        console.log('publish',id)
        const writer_id = data.id
        const queryId = 'SELECT * FROM articles_draft WHERE id = $1';
        const { rows } = await pool.query(queryId, [id]);
        const writerId = rows[0].writer_id
        const content = rows[0].content
        const title = rows[0].title
        const url_image = rows[0].url_image
        const descrip = rows[0].descrip
        
    
        if (writer_id == writerId) {
          const query2 ='INSERT INTO articles (title, content, writer_id, article_id,url_image, Descrip) VALUES ($1, $2, $3, $4, $5, $6)'
          await pool.query(query2, [title, content, writerId, id, url_image, descrip]);
          const query = 'UPDATE articles_draft SET status = true WHERE id = $1';
          await pool.query(query, [id]);
      
          res.status(201).json({ message: 'article diupdate' });
        }else{
          res.status(500).json({ error: 'artikel gagal dibuat' });
        }
      } catch (error) {
        console.error('Error saat mendaftar', error);
        res.status(500).json({ error: 'artikel gagal dibuat' });
      }
    });

    router.post('/updatePublish',verifyToken, async (req, res) => {
      try {
        const tokenHeaderKey = "jwt-token";
        const { id } = req.body;
        const data =JSON.parse(req.headers[tokenHeaderKey]);
        console.log('publish',id)
        const writer_id = data.id
        const queryId = 'SELECT * FROM articles_draft WHERE id = $1';
        const { rows } = await pool.query(queryId, [id]);
        const writerId = rows[0].writer_id
        const content = rows[0].content
        const title = rows[0].title
        const url_image = rows[0].url_image
        const descrip = rows[0].descrip
        
    
        if (writer_id == writerId) {
          const query2 =`UPDATE articles
          SET
            title = $1,
            content = $2,
            writer_id = $3,
            url_image = $5,
            Descrip = $6
          WHERE
            article_id = $4;
          `
          await pool.query(query2, [title, content, writerId, id, url_image, descrip]);
      
          res.status(201).json({ message: 'article diupdate' });
        }else{
          res.status(500).json({ error: 'artikel gagal dibuat' });
        }
      } catch (error) {
        console.error('Error saat mendaftar', error);
        res.status(500).json({ error: 'artikel gagal dibuat' });
      }
    });


    router.delete('/unpublish',verifyToken, async (req, res) => {
      try {
        const tokenHeaderKey = "jwt-token";
        const { id } = req.body;
        const data =JSON.parse(req.headers[tokenHeaderKey]);
        const writer_id = data.id
        console.log(id)
        const queryId = 'SELECT * FROM articles_draft WHERE id = $1';
        const { rows } = await pool.query(queryId, [id]);
        const writerId = rows[0].writer_id
        
        
    
        if (writer_id == writerId) {
  
    console.log('berhasil')
          // Setelah menghapus data terkait dari 'article_tags', baru hapus artikel dari 'articles_draft'
          const deleteArticleQuery = 'DELETE FROM articles WHERE article_id = $1';
          await pool.query(deleteArticleQuery, [id]);
          const query = 'UPDATE articles_draft SET status = false WHERE id = $1';
          await pool.query(query, [id]);
          console.log('berhasil')
      
          res.status(201).json({ message: `article berhasil dihapus` });
        }else{
          res.status(500).json({ error: 'artikel gagal dihapus' });
        }
      } catch (error) {
        console.error('Error saat mendaftar', error);
        res.status(500).json({ error: 'artikel gagal dihapus' });
      }
    });
  



// Ekspor router
module.exports = router;
