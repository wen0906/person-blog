const express = require('express');
const { getDb } = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, (req, res) => {
  const { page = 1, limit = 10, category_id, status, keyword } = req.query;
  const offset = (page - 1) * limit;
  const db = getDb();
  
  let query = `SELECT p.*, c.name as category_name 
               FROM posts p LEFT JOIN categories c ON p.category_id = c.id 
               WHERE 1=1`;
  const params = [];
  
  if (category_id) {
    query += ' AND p.category_id = ?';
    params.push(category_id);
  }
  if (status) {
    query += ' AND p.status = ?';
    params.push(status);
  }
  if (keyword) {
    query += ' AND (p.title LIKE ? OR p.content LIKE ?)';
    params.push(`%${keyword}%`, `%${keyword}%`);
  }
  
  query += ' ORDER BY p.top DESC, p.created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));
  
  const posts = db.all(query, params);
  
  let countQuery = 'SELECT COUNT(*) as total FROM posts WHERE 1=1';
  const countParams = [];
  
  if (category_id) {
    countQuery += ' AND category_id = ?';
    countParams.push(category_id);
  }
  if (status) {
    countQuery += ' AND status = ?';
    countParams.push(status);
  }
  if (keyword) {
    countQuery += ' AND (title LIKE ? OR content LIKE ?)';
    countParams.push(`%${keyword}%`, `%${keyword}%`);
  }
  
  const row = db.get(countQuery, countParams);
  
  const postsWithTags = posts.map(post => {
    const tags = db.all('SELECT t.id, t.name FROM post_tags pt JOIN tags t ON pt.tag_id = t.id WHERE pt.post_id = ?', [post.id]);
    return { ...post, tags };
  });
  
  res.json({
    success: true,
    data: {
      list: postsWithTags,
      total: row ? row.total : 0,
      page: parseInt(page),
      limit: parseInt(limit)
    }
  });
});

router.get('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  
  const post = db.get('SELECT p.*, c.name as category_name FROM posts p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?', [id]);
  if (!post) {
    return res.status(404).json({ success: false, message: '文章不存在' });
  }
  
  const tags = db.all('SELECT t.id, t.name FROM post_tags pt JOIN tags t ON pt.tag_id = t.id WHERE pt.post_id = ?', [id]);
  res.json({ success: true, data: { ...post, tags } });
});

router.post('/', verifyToken, (req, res) => {
  const { title, content, excerpt, category_id, status, top, tags } = req.body;
  const db = getDb();
  
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
  
  try {
    db.run('INSERT INTO posts (title, content, excerpt, slug, category_id, status, top) VALUES (?, ?, ?, ?, ?, ?, ?)', [title, content, excerpt, slug, category_id || null, status || 'draft', top || 0]);
    
    const lastIdResult = db.get('SELECT last_insert_rowid() as id');
    const postId = lastIdResult.id;
    
    if (tags && Array.isArray(tags)) {
      tags.forEach(tagId => {
        db.run('INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)', [postId, tagId]);
      });
    }
    
    res.json({ success: true, message: '创建成功', data: { id: postId } });
  } catch (err) {
    res.status(500).json({ success: false, message: '创建失败' });
  }
});

router.put('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { title, content, excerpt, category_id, status, top, tags } = req.body;
  const db = getDb();
  
  try {
    db.run('UPDATE posts SET title = ?, content = ?, excerpt = ?, category_id = ?, status = ?, top = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [title, content, excerpt, category_id || null, status, top, id]);
    
    db.run('DELETE FROM post_tags WHERE post_id = ?', [id]);
    
    if (tags && Array.isArray(tags)) {
      tags.forEach(tagId => {
        db.run('INSERT OR IGNORE INTO post_tags (post_id, tag_id) VALUES (?, ?)', [id, tagId]);
      });
    }
    
    res.json({ success: true, message: '更新成功' });
  } catch (err) {
    res.status(500).json({ success: false, message: '更新失败' });
  }
});

router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const db = getDb();
  
  try {
    db.run('DELETE FROM post_tags WHERE post_id = ?', [id]);
    db.run('DELETE FROM posts WHERE id = ?', [id]);
    res.json({ success: true, message: '删除成功' });
  } catch (err) {
    res.status(500).json({ success: false, message: '删除失败' });
  }
});

module.exports = router;