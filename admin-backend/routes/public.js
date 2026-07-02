const express = require('express');
const { getDb } = require('../db');

const router = express.Router();

router.get('/posts', (req, res) => {
  const { page = 1, limit = 10, category_id, tag_id, keyword } = req.query;
  const offset = (page - 1) * limit;
  const db = getDb();
  
  let query = `SELECT p.*, c.name as category_name 
               FROM posts p LEFT JOIN categories c ON p.category_id = c.id 
               WHERE p.status = 'published'`;
  const params = [];
  
  if (category_id) {
    query += ' AND p.category_id = ?';
    params.push(category_id);
  }
  if (tag_id) {
    query += ' AND p.id IN (SELECT post_id FROM post_tags WHERE tag_id = ?)';
    params.push(tag_id);
  }
  if (keyword) {
    query += ' AND (p.title LIKE ? OR p.content LIKE ?)';
    params.push(`%${keyword}%`, `%${keyword}%`);
  }
  
  query += ' ORDER BY p.top DESC, p.created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));
  
  const posts = db.all(query, params);
  
  let countQuery = 'SELECT COUNT(*) as total FROM posts WHERE status = "published"';
  const countParams = [];
  
  if (category_id) {
    countQuery += ' AND category_id = ?';
    countParams.push(category_id);
  }
  if (tag_id) {
    countQuery += ' AND id IN (SELECT post_id FROM post_tags WHERE tag_id = ?)';
    countParams.push(tag_id);
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

router.get('/posts/:id', (req, res) => {
  const { id } = req.params;
  const db = getDb();
  
  const post = db.get('SELECT p.*, c.name as category_name FROM posts p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ? AND p.status = "published"', [id]);
  if (!post) {
    return res.status(404).json({ success: false, message: '文章不存在' });
  }
  
  const tags = db.all('SELECT t.id, t.name FROM post_tags pt JOIN tags t ON pt.tag_id = t.id WHERE pt.post_id = ?', [id]);
  
  db.run('UPDATE posts SET view_count = COALESCE(view_count, 0) + 1 WHERE id = ?', [id]);
  
  res.json({ success: true, data: { ...post, tags } });
});

router.get('/categories', (req, res) => {
  const db = getDb();
  const categories = db.all(`SELECT c.*, COUNT(p.id) as post_count 
                             FROM categories c LEFT JOIN posts p ON c.id = p.category_id AND p.status = 'published' 
                             GROUP BY c.id ORDER BY c.sort_order ASC`);
  res.json({ success: true, data: categories });
});

router.get('/tags', (req, res) => {
  const db = getDb();
  const tags = db.all(`SELECT t.*, COUNT(pt.post_id) as post_count 
                       FROM tags t LEFT JOIN post_tags pt ON t.id = pt.tag_id 
                       LEFT JOIN posts p ON pt.post_id = p.id AND p.status = 'published'
                       GROUP BY t.id ORDER BY t.created_at DESC`);
  res.json({ success: true, data: tags });
});

router.get('/settings', (req, res) => {
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

router.get('/archives', (req, res) => {
  const db = getDb();
  const archives = db.all(`SELECT strftime('%Y', created_at) as year, 
                                   strftime('%m', created_at) as month, 
                                   COUNT(*) as count 
                            FROM posts 
                            WHERE status = 'published' 
                            GROUP BY year, month 
                            ORDER BY year DESC, month DESC`);
  res.json({ success: true, data: archives });
});

module.exports = router;