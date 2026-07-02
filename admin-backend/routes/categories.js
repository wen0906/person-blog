const express = require('express');
const { getDb } = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, (req, res) => {
  const db = getDb();
  const categories = db.all('SELECT * FROM categories ORDER BY sort_order ASC');
  res.json({ success: true, data: categories });
});

router.get('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  
  const category = db.get('SELECT * FROM categories WHERE id = ?', [id]);
  if (!category) {
    return res.status(404).json({ success: false, message: '分类不存在' });
  }
  res.json({ success: true, data: category });
});

router.post('/', verifyToken, (req, res) => {
  const { name, description, sort_order } = req.body;
  const db = getDb();
  
  try {
    db.run('INSERT INTO categories (name, description, sort_order) VALUES (?, ?, ?)', [name, description || '', sort_order || 0]);
    const lastIdResult = db.get('SELECT last_insert_rowid() as id');
    res.json({ success: true, message: '创建成功', data: { id: lastIdResult.id } });
  } catch (err) {
    res.status(500).json({ success: false, message: '创建失败' });
  }
});

router.put('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { name, description, sort_order } = req.body;
  const db = getDb();
  
  try {
    db.run('UPDATE categories SET name = ?, description = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [name, description || '', sort_order || 0, id]);
    res.json({ success: true, message: '更新成功' });
  } catch (err) {
    res.status(500).json({ success: false, message: '更新失败' });
  }
});

router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  
  const row = db.get('SELECT COUNT(*) as count FROM posts WHERE category_id = ?', [id]);
  if (row && row.count > 0) {
    return res.status(400).json({ success: false, message: '该分类下存在文章，无法删除' });
  }
  
  try {
    db.run('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ success: true, message: '删除成功' });
  } catch (err) {
    res.status(500).json({ success: false, message: '删除失败' });
  }
});

module.exports = router;