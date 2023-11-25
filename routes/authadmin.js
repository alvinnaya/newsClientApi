const jwt = require('jsonwebtoken');

function generateToken(userId) {
  const time = 1000*3600*24*2
  const token = jwt.sign({ id: userId }, 'secretKeyAdmin', { expiresIn: time});
  return token;
}

module.exports = generateToken;