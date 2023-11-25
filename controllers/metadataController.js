const axios = require('axios');
const cheerio = require('cheerio');

// Fungsi untuk mengambil metadata dari URL
async function getMetadata(url) {
  try {
    // Mengambil konten dari URL
    const response = await axios.get(url);

    // Jika respons berhasil
    if (response.status === 200) {
      // Jika URL adalah halaman web, kita dapat menggunakan Cheerio untuk menguraikan HTML
      if (response.headers['content-type'].includes('text/html')) {
        const $ = cheerio.load(response.data);

        // Memilih semua tag <meta>
        const metaTags = $('meta');

        // Menyiapkan objek untuk menyimpan metadata
        const metadata = {};

        // Menambahkan semua informasi dari tag <meta> ke objek metadata
        metaTags.each((index, element) => {
          const name = $(element).attr('name') || $(element).attr('property') || 'No Name';
          const content = $(element).attr('content') || 'No Content';
          metadata[name] = content;
        });

        return metadata;
      } else {
        throw new Error('Ini bukan halaman web.');
      }
    } else {
      throw new Error('Gagal mengambil URL.');
    }
  } catch (error) {
    throw error;
  }
}

// Fungsi tambahan untuk mengambil teks paragraf dari halaman web
async function getParagraphs(url) {
  try {
    // Mengambil konten dari URL
    const response = await axios.get(url);

    // Jika respons berhasil
    if (response.status === 200) {
      // Jika URL adalah halaman web, kita dapat menggunakan Cheerio untuk menguraikan HTML
      if (response.headers['content-type'].includes('text/html')) {
        const $ = cheerio.load(response.data);

        // Memilih semua tag <p>
        const paragraphs = [];

        $('p').each((index, element) => {
          const paragraphText = $(element).text();
          paragraphs.push(paragraphText);
        });
        $('h1').each((index, element) => {
          const paragraphText = $(element).text();
          paragraphs.push(paragraphText);
        });

        $('img').each((index, element) => {
          const paragraphText = $(element).text();
          paragraphs.push(paragraphText);
        });

        return paragraphs;
      } else {
        throw new Error('Ini bukan halaman web.');
      }
    } else {
      throw new Error('Gagal mengambil URL.');
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getMetadata,
  getParagraphs, // Menambahkan fungsi getParagraphs ke ekspor
};
