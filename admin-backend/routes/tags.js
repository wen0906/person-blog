const express = require('express');
const { getDb } = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, (req, res) => {
  const db = getDb();
  const tags = db.all('SELECT t.*, COUNT(pt.post_id) as post_count FROM tags t LEFT JOIN post_tags pt ON t.id = pt.tag_id GROUP BY t.id ORDER BY t.created_at DESC');
  res.json({ success: true, data: tags });
});

router.get('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  
  const tag = db.get('SELECT * FROM tags WHERE id = ?', [id]);
  if (!tag) {
    return res.status(404).json({ success: false, message: '标签不存在' });
  }
  res.json({ success: true, data: tag });
});

router.post('/', verifyToken, (req, res) => {
  const { name } = req.body;
  const db = getDb();
  
  try {
    db.run('INSERT INTO tags (name) VALUES (?)', [name]);
    const lastIdResult = db.get('SELECT last_insert_rowid() as id');
    res.json({ success: true, message: '创建成功', data: { id: lastIdResult.id } });
  } catch (err) {
    res.status(500).json({ success: false, message: '创建失败' });
  }
});

router.put('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const db = getDb();
  
  try {
    db.run('UPDATE tags SET name = ? WHERE id = ?', [name, id]);
    res.json({ success: true, message: '更新成功' });
  } catch (err) {
    res.status(500).json({ success: false, message: '更新失败' });
  }
});

router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  
  try {
    db.run('DELETE FROM post_tags WHERE tag_id = ?', [id]);
    db.run('DELETE FROM tags WHERE id = ?', [id]);
    res.json({ success: true, message: '删除成功' });
  } catch (err) {
    res.status(500).json({ success: false, message: '删除失败' });
  }
});

module.exports = router;