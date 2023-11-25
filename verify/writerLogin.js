const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  console.log('verifyToken')
  const tokenHeaderKey = "jwt-token";
  const data =JSON.parse(req.headers[tokenHeaderKey]);
  // const accessToken = localStorage.getItem('accessToken');

  try {
    console.log('1')
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
    console.error(error);
    res.status(401).json({ message: 'Token tidak valid' });
    console.log('jwt kadaluarsa')
  }


  
}

module.exports = verifyToken;
