const express = require('express');
const router = express.Router();
const metadataController = require('../controllers/metadataController');

// Endpoint untuk mendapatkan metadata dari URL
router.get('/getMetadata', async (req, res) => {
  const { url } = req.query;

  try {
    
    const metadata = await metadataController.getMetadata(url);
    res.json(metadata);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/getParagraph', async (req, res) => {
  const { url } = req.query;

  try {
    
    const metadata = await metadataController.getParagraphs(url);
    res.json(metadata);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
module.exports = router;
