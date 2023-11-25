// Fungsi untuk mengambil metadata dari URL
async function getMostFreqData(data, parameter) {
    try {
      // Membuat objek untuk menyimpan jumlah munculan masing-masing parameter
      const counts = {};
  
      // Menghitung jumlah munculan setiap parameter
      for (const item of data) {
        if (counts[item[parameter]]) {
          counts[item[parameter]]++;
        } else {
          counts[item[parameter]] = 1;
        }
      }
  
      // Mengonversi objek hitungan ke dalam array
      const countArray = Object.entries(counts);
  
      // Mengurutkan array berdasarkan jumlah munculan secara menurun
      countArray.sort((a, b) => b[1] - a[1]);
  
      // Mengambil parameter dengan jumlah munculan tertinggi
      const mostFrequentParameters = countArray.map(([param]) => param);
  
      return mostFrequentParameters;
    } catch (error) {
      throw error;
    }
  }
  
  module.exports = {
    getMostFreqData,
  };
  