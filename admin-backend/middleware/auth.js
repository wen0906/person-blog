const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your-secret-key-change-in-production';

const generateToken = (userId, username) => {
  return jwt.sign({ userId, username }, SECRET_KEY, { expiresIn: '7d' });
};

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ success: false, message: '没有提供token' });
  }

  jwt.verify(token.replace('Bearer ', ''), SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'token无效或已过期' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = { generateToken, verifyToken };