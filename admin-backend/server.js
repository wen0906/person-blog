const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { initDatabase } = require('./db');

const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const categoriesRoutes = require('./routes/categories');
const tagsRoutes = require('./routes/tags');
const settingsRoutes = require('./routes/settings');
const publicRoutes = require('./routes/public');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/public', publicRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ success: true, message: '博客后台管理API服务运行正常' });
});

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`\n=========================================`);
    console.log(`博客后台管理API服务已启动`);
    console.log(`服务地址: http://localhost:${PORT}`);
    console.log(`API文档: http://localhost:${PORT}/`);
    console.log(`=========================================\n`);
  });
});