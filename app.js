const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');


const app = express();

// Set konfigurasi CORS sesuai kebutuhan Anda
const corsOptions = {
  origin: 'http://localhost:3001', // Ganti dengan URL asal aplikasi Anda
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// ... kode lainnya ...


app.use(bodyParser.json());
app.use(cookieParser());



app.use('/uploads',express.static('uploads'))
// Impor berkas route
const writerRoutes = require('./routes/writer');
const articleRoutes = require('./routes/article');
const adminRoutes = require('./routes/admin');
const imageRoutes = require('./routes/imageUpload');
const metadataRoute = require('./routes/metadataRoute');
const rekomen = require('./routes/recomendation');
const ads = require('./routes/ads');
app.use('/api/writer', writerRoutes);
app.use('/api/article', articleRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/metadata', metadataRoute);
app.use('/api/recomendation', rekomen);
app.use('/api/ads', ads);

  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan pada port ${PORT}`);
});


