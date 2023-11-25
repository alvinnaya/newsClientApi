
const jwt = require('jsonwebtoken');

function verifyTokenAdmin(req, res, next) {
  console.log('verifyToken admin')
  const tokenHeaderKey = "admin-token";
  const data =JSON.parse(req.headers[tokenHeaderKey]);
  // const accessToken = localStorage.getItem('accessToken');

  try {
    console.log('1')
    console.log(data)
    const verified = jwt.verify(data.token, "secretKey");
    console.log('2')
    console.log(verified)
    console.log(verified.id)
    console.log(data.id)
    if (verified && verified.id == data.id) {
      console.log('dilewati')
      console.log('verifyToken end')
      next();
    } else {
      // Access Denied
      return res.status(401).json({ message: "error" });
    }
  } catch (error) {
    console.error('token admin',error);
    res.status(401).json({ message: 'Token tidak valid' });
    console.log('jwt kadaluarsa')
  }


  
}

module.exports = verifyTokenAdmin;

