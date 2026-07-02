const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'blog.db');
let db = null;

const initDatabase = async () => {
  const SQL = await initSqlJs({
    locateFile: file => `node_modules/sql.js/dist/${file}`
  });

  if (fs.existsSync(dbPath)) {
    const data = fs.readFileSync(dbPath);
    db = new SQL.Database(data);
  } else {
    db = new SQL.Database();
  }

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    slug TEXT UNIQUE,
    category_id INTEGER,
    status TEXT DEFAULT 'draft',
    top INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS post_tags (
    post_id INTEGER,
    tag_id INTEGER,
    PRIMARY KEY (post_id, tag_id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    value TEXT,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  const userCount = queryOne('SELECT COUNT(*) as count FROM users');
  if (userCount && userCount.count === 0) {
    const hash = bcrypt.hashSync('admin123', 10);
    db.run('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', ['admin', hash, 'admin@example.com']);
    console.log('默认管理员账号已创建: admin/admin123');
  }

  const catCount = queryOne('SELECT COUNT(*) as count FROM categories');
  if (catCount && catCount.count === 0) {
    db.run('INSERT INTO categories (name, description, sort_order) VALUES (?, ?, ?)', ['技术', '技术相关文章', 1]);
    db.run('INSERT INTO categories (name, description, sort_order) VALUES (?, ?, ?)', ['生活', '生活感悟分享', 2]);
    db.run('INSERT INTO categories (name, description, sort_order) VALUES (?, ?, ?)', ['博客', '博客相关内容', 3]);
    console.log('默认分类已创建');
  }

  const tagCount = queryOne('SELECT COUNT(*) as count FROM tags');
  if (tagCount && tagCount.count === 0) {
    db.run('INSERT INTO tags (name) VALUES (?)', ['Hexo']);
    db.run('INSERT INTO tags (name) VALUES (?)', ['Vue']);
    db.run('INSERT INTO tags (name) VALUES (?)', ['Node.js']);
    db.run('INSERT INTO tags (name) VALUES (?)', ['前端']);
    console.log('默认标签已创建');
  }

  const settingCount = queryOne('SELECT COUNT(*) as count FROM settings');
  if (settingCount && settingCount.count === 0) {
    db.run('INSERT INTO settings (key, value, description) VALUES (?, ?, ?)', ['site_title', '我的个人博客', '网站标题']);
    db.run('INSERT INTO settings (key, value, description) VALUES (?, ?, ?)', ['site_subtitle', '记录生活，分享技术', '网站副标题']);
    db.run('INSERT INTO settings (key, value, description) VALUES (?, ?, ?)', ['site_description', '一个简洁优雅的个人博客', '网站描述']);
    db.run('INSERT INTO settings (key, value, description) VALUES (?, ?, ?)', ['site_author', '你的名字', '网站作者']);
    db.run('INSERT INTO settings (key, value, description) VALUES (?, ?, ?)', ['site_url', 'https://yourusername.github.io', '网站地址']);
    console.log('默认设置已创建');
  }

  saveDatabase();
  setInterval(saveDatabase, 5000);
};

const saveDatabase = () => {
  if (db) {
    const data = db.export();
    fs.writeFileSync(dbPath, Buffer.from(data));
  }
};

const queryOne = (sql, params = []) => {
  const stmt = db.prepare(sql);
  const columns = stmt.getColumnNames();
  stmt.bind(params);
  if (stmt.step()) {
    const result = stmt.get();
    stmt.free();
    if (Array.isArray(result)) {
      const obj = {};
      columns.forEach((name, index) => {
        obj[name] = result[index];
      });
      return obj;
    }
    return result;
  }
  stmt.free();
  return null;
};

const queryAll = (sql, params = []) => {
  const stmt = db.prepare(sql);
  const columns = stmt.getColumnNames();
  stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    const row = stmt.get();
    const obj = {};
    columns.forEach((name, index) => {
      obj[name] = row[index];
    });
    results.push(obj);
  }
  stmt.free();
  return results;
};

const execute = (sql, params = []) => {
  db.run(sql, params);
};

const getDb = () => ({
  get: queryOne,
  all: queryAll,
  run: execute
});

module.exports = { getDb, initDatabase, saveDatabase };