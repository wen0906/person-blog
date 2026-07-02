const express = require('express');
const bcrypt = require('bcryptjs');
const { getDb } = require('../db');
const { generateToken, verifyToken } = require('../middleware/auth');

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const db = getDb();
  
  const user = db.get('SELECT * FROM users WHERE username = ?', [username]);
  if (!user) {
    return res.status(401).json({ success: false, message: '用户名或密码错误' });
  }
  
  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: '用户名或密码错误' });
  }
  
  const token = generateToken(user.id, user.username);
  res.json({
    success: true,
    message: '登录成功',
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    }
  });
});

router.get('/me', verifyToken, (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

router.post('/change-password', verifyToken, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const db = getDb();
  
  const user = db.get('SELECT * FROM users WHERE id = ?', [req.user.userId]);
  if (!user) {
    return res.status(500).json({ success: false, message: '用户不存在' });
  }
  
  const isMatch = bcrypt.compareSync(oldPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: '旧密码错误' });
  }
  
  const hash = bcrypt.hashSync(newPassword, 10);
  db.run('UPDATE users SET password = ? WHERE id = ?', [hash, req.user.userId]);
  res.json({ success: true, message: '密码修改成功' });
});

module.exports = router;