const express = require('express');
const { getDb } = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, (req, res) => {
  const db = getDb();
  const settings = db.all('SELECT * FROM settings ORDER BY id ASC');
  const settingsObj = {};
  settings.forEach(item => {
    settingsObj[item.key] = {
      value: item.value,
      description: item.description
    };
  });
  res.json({ success: true, data: settingsObj });
});

router.put('/', verifyToken, (req, res) => {
  const settings = req.body;
  const db = getDb();
  
  try {
    for (const key in settings) {
      db.run('UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?', [settings[key], key]);
    }
    res.json({ success: true, message: '更新成功' });
  } catch (err) {
    res.status(500).json({ success: false, message: '更新失败' });
  }
});

router.post('/', verifyToken, (req, res) => {
  const { key, value, description } = req.body;
  const db = getDb();
  
  try {
    db.run('INSERT INTO settings (key, value, description) VALUES (?, ?, ?)', [key, value, description]);
    const lastIdResult = db.get('SELECT last_insert_rowid() as id');
    res.json({ success: true, message: '创建成功', data: { id: lastIdResult.id } });
  } catch (err) {
    res.status(500).json({ success: false, message: '创建失败' });
  }
});

router.delete('/:key', verifyToken, (req, res) => {
  const { key } = req.params;
  const db = getDb();
  
  try {
    db.run('DELETE FROM settings WHERE key = ?', [key]);
    res.json({ success: true, message: '删除成功' });
  } catch (err) {
    res.status(500).json({ success: false, message: '删除失败' });
  }
});

module.exports = router;