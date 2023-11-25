const jwt = require('jsonwebtoken');

function generateToken(userId) {
  const time = 1000*3600*24
  const token = jwt.sign({ id: userId }, 'secretKey', { expiresIn: time });
  return token;
}

module.exports = generateToken;