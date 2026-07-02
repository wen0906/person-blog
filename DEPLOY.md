# 博客部署指南

本指南详细说明如何将博客部署到各个免费平台。

## 前置准备

1. 注册 GitHub 账号：https://github.com/
2. 安装 Git：https://git-scm.com/
3. 安装 Node.js 18+：https://nodejs.org/

## 部署方式选择

本项目支持三种免费部署方式：

| 部署平台 | 优点 | 适用场景 | 访问速度 |
|---------|------|---------|---------|
| GitHub Pages | 完全免费、稳定、无需服务器 | 个人博客、项目文档 | 国内访问较慢 |
| Vercel | 全球CDN、速度快、免费流量充足 | 需要国内外都访问快的博客 | 全球访问快 |
| Cloudflare Pages | 全球CDN、免费无限流量、速度快 | 流量大的博客 | 全球访问快 |

推荐顺序：Vercel > Cloudflare Pages > GitHub Pages

---

## 方式一：GitHub Pages 部署

### 步骤详解

#### 1. 创建 GitHub 仓库

有两种方式：

**方式A：创建 yourusername.github.io 仓库（推荐）**

- 仓库名必须为 `yourusername.github.io`（yourusername 替换为你的 GitHub 用户名）
- 博客将部署在根目录，访问地址为 `https://yourusername.github.io`
- 修改 `_config.yml`：
  ```yaml
  url: https://yourusername.github.io
  root: /
  ```

**方式B：创建任意名称的仓库**

- 仓库名可以是任意名称，如 `my-blog`
- 博客将部署在子目录，访问地址为 `https://yourusername.github.io/my-blog/`
- 修改 `_config.yml`：
  ```yaml
  url: https://yourusername.github.io/my-blog
  root: /my-blog/
  ```

#### 2. 上传项目到 GitHub

```bash
# 在项目根目录执行
git init
git add .
git commit -m "初始化博客项目"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

#### 3. 配置 GitHub Actions 自动部署

项目已包含自动部署配置文件 `.github/workflows/deploy.yml`。

确保配置正确：

```yaml
deploy:
  type: git
  repo: https://github.com/yourusername/your-repo.git
  branch: main
```

#### 4. 启用 GitHub Pages

1. 进入 GitHub 仓库页面
2. 点击 Settings → Pages
3. 在 "Source" 下拉菜单中选择 `gh-pages` 分支
4. 选择 `/ (root)` 目录
5. 点击 Save

等待 1-3 分钟，GitHub 会自动构建和部署。

#### 5. 访问博客

访问地址：
- 根目录部署：`https://yourusername.github.io`
- 子目录部署：`https://yourusername.github.io/仓库名/`

#### 6. 后续更新

每次推送新的文章到 `main` 分支，GitHub Actions 会自动构建并部署：

```bash
# 创建新文章
npx hexo new "新文章标题"

# 写作完成后推送
git add .
git commit -m "发布新文章"
git push
```

---

## 方式二：Vercel 部署

### 步骤详解

#### 1. 准备 GitHub 仓库

按照 "GitHub Pages 部署" 的步骤 1-2 创建并上传项目到 GitHub。

#### 2. 注册 Vercel 账号

访问 https://vercel.com/，使用 GitHub 账号登录。

#### 3. 导入项目

1. 登录 Vercel Dashboard
2. 点击 "Add New..." → "Project"
3. 在 "Import Git Repository" 中选择你的 GitHub 仓库
4. 点击 "Import"

#### 4. 配置项目

Vercel 会自动识别 Hexo 项目，默认配置如下：

- **Framework Preset**: Other
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `public`
- **Install Command**: `npm install`

确认配置正确后点击 "Deploy"。

#### 5. 等待部署

Vercel 会自动安装依赖、构建项目并部署，大约需要 1-2 分钟。

部署成功后会显示庆祝界面，并提供访问地址。

#### 6. 访问博客

Vercel 会提供一个免费的访问地址，格式为：
- `https://你的项目名.vercel.app`

#### 7. 绑定自定义域名（可选）

1. 进入 Vercel 项目设置
2. 点击 Domains
3. 添加你的自定义域名
4. 在域名服务商处配置 DNS 解析：
   - A 记录：`76.76.21.21`
   - CNAME 记录：`cname.vercel-dns.com`

#### 8. 后续更新

每次推送到 GitHub 仓库，Vercel 会自动检测并重新部署。

---

## 方式三：Cloudflare Pages 部署

### 步骤详解

#### 1. 准备 GitHub 仓库

按照 "GitHub Pages 部署" 的步骤 1-2 创建并上传项目到 GitHub。

#### 2. 注册 Cloudflare 账号

访问 https://dash.cloudflare.com/，注册账号。

#### 3. 创建 Pages 项目

1. 登录 Cloudflare Dashboard
2. 在左侧菜单点击 "Workers & Pages"
3. 点击 "Create application"
4. 选择 "Pages" → "Connect to Git"

#### 4. 连接 GitHub

1. 点击 "Connect GitHub"
2. 授权 Cloudflare 访问你的 GitHub 仓库
3. 选择你的博客仓库
4. 点击 "Begin setup"

#### 5. 配置构建设置

填写以下信息：

- **Project name**: 你的项目名称（决定访问地址）
- **Production branch**: `main`
- **Build command**: `npm run build`
- **Build output directory**: `public`

点击 "Save and Deploy"。

#### 6. 等待部署

Cloudflare 会自动安装依赖、构建项目并部署，大约需要 2-3 分钟。

部署成功后会显示成功页面。

#### 7. 访问博客

Cloudflare 会提供一个免费的访问地址，格式为：
- `https://你的项目名.pages.dev`

#### 8. 绑定自定义域名（可选）

1. 进入 Cloudflare Pages 项目设置
2. 点击 "Custom domains"
3. 点击 "Set up a custom domain"
4. 输入你的域名
5. 按照提示配置 DNS（如果域名已在 Cloudflare，会自动配置）

#### 9. 后续更新

每次推送到 GitHub 仓库，Cloudflare Pages 会自动检测并重新部署。

---

## 评论系统配置（Giscus）

Giscus 是一个基于 GitHub Discussions 的免费评论系统。

### 配置步骤

#### 1. 启用 Discussions

在 GitHub 仓库中启用 Discussions 功能：

1. 进入仓库 Settings
2. 在 Features 部分勾选 "Discussions"

#### 2. 访问 Giscus 配置页面

访问 https://giscus.app/zh-CN

#### 3. 配置 Giscus

按照页面提示依次配置：

1. **仓库**：输入你的 GitHub 仓库地址
   - 仓库必须公开
   - 仓库已启用 Discussions

2. **页面 ↔️ Discussions 映射关系**：
   - 选择 "Discussion 的标题包含页面标题"（推荐）

3. **Discussion 分类**：
   - 选择 "Announcements"（推荐）

4. **特性**：
   - 启用 "主评论置顶"
   - 启用 "懒加载评论"

5. **主题**：
   - 选择 "Light" 和 "Dark" 主题

6. 复制生成的配置代码

#### 4. 更新博客配置

将复制的配置信息填入 `_config.butterfly.yml`：

```yaml
comments:
  active: giscus
  giscus:
    repo: yourusername/your-repo
    repo_id: 从Giscus获取
    category: Announcements
    category_id: 从Giscus获取
    theme: light
    theme_dark: dark
    mapping: pathname
    reactions_enabled: 1
    emit_metadata: 0
    lang: zh-CN
```

将 `repo_id` 和 `category_id` 替换为从 Giscus 获取的实际值。

#### 5. 测试评论

部署博客后，访问任意文章页面，测试评论功能是否正常。

---

## 图片资源管理

### 方式一：本地存储

将图片放在 `source/images/` 目录，在文章中使用：

```markdown
![图片描述](/images/picture.jpg)
```

**优点**：简单方便
**缺点**：占用仓库空间，影响加载速度

### 方式二：GitHub 图床

1. 创建专门的图床仓库
2. 使用 PicGo 工具上传图片
3. 在文章中使用图床链接

**优点**：不占用博客仓库空间
**缺点**：需要额外配置

### 方式三：免费图床服务

使用免费图床服务，如：
- Imgur
- SM.MS
- ImgBB

**优点**：免费、速度快
**缺点**：可能不稳定

---

## 自定义域名配置

### 前置条件

1. 购买域名（阿里云、腾讯云、Namesilo 等）
2. 域名已完成实名认证（国内域名）

### GitHub Pages 域名配置

1. 在 `_config.yml` 中修改 url：
   ```yaml
   url: https://yourdomain.com
   root: /
   ```

2. 在域名服务商配置 DNS：
   - A 记录：`185.199.108.153`
   - A 记录：`185.199.109.153`
   - A 记录：`185.199.110.153`
   - A 记录：`185.199.111.153`

3. 在 GitHub 仓库 Settings → Pages → Custom domain 中添加域名

4. 等待 DNS 解析生效（通常需要几分钟到几小时）

### Vercel 域名配置

参考 "Vercel 部署" 的步骤 7。

### Cloudflare Pages 域名配置

参考 "Cloudflare Pages 部署" 的步骤 8。

---

## SEO 优化

### 1. 提交到搜索引擎

#### Google

1. 访问 Google Search Console：https://search.google.com/search-console
2. 添加网站属性
3. 提交 sitemap：`https://yourdomain.com/sitemap.xml`

#### 百度

1. 访问百度搜索资源平台：https://ziyuan.baidu.com/
2. 添加网站
3. 提交 sitemap

### 2. 添加站点验证

在 `_config.butterfly.yml` 中添加站点验证代码：

```yaml
site_verification:
  - name: google_site_verification
    content: 你的Google验证码
  - name: baidu_site_verification
    content: 你的百度验证码
```

### 3. 文章优化建议

- 撰写有意义的文章标题
- 添加文章描述和关键词
- 使用合理的分类和标签
- 文章内容充实，有明确主题
- 定期更新博客内容

---

## 性能优化

### 1. 图片优化

- 使用 WebP 格式图片
- 压缩图片大小
- 使用 CDN 加速图片加载

### 2. 代码优化

- 项目已启用代码压缩
- 启用图片懒加载

### 3. CDN 加速

如果使用 GitHub Pages，可以配合 Cloudflare CDN 加速：

1. 将域名 DNS 解析到 Cloudflare
2. 在 Cloudflare 中配置 CDN
3. 开启缓存和加速功能

---

## 常见问题解决

### Q1: 部署后页面空白或样式错乱

**原因**：`root` 配置不正确

**解决**：
- 根目录部署：`root: /`
- 子目录部署：`root: /仓库名/`

### Q2: GitHub Actions 部署失败

**检查**：
- 查看 Actions 日志找出具体错误
- 确保 `package.json` 依赖正确
- 确保 `_config.yml` 配置正确

### Q3: 评论系统无法显示

**检查**：
- GitHub 仓库是否启用 Discussions
- `_config.butterfly.yml` 中 Giscus 配置是否正确
- `repo_id` 和 `category_id` 是否填写

### Q4: 自定义域名无法访问

**检查**：
- DNS 解析是否正确配置
- 域名是否已完成实名认证
- HTTPS 证书是否生效（通常需要等待几分钟）

### Q5: 图片无法加载

**解决**：
- 检查图片路径是否正确
- 确保图片文件已上传到正确位置
- 使用绝对路径引用图片

---

## 部署检查清单

部署前请确认：

- ✅ 已修改 `_config.yml` 中的 `url` 和 `root` 配置
- ✅ 已修改 `_config.butterfly.yml` 中的个人信息
- ✅ 已创建至少一篇测试文章
- ✅ 本地预览无错误
- ✅ 已创建 GitHub 仓库并上传代码
- ✅ 已配置自动部署
- ✅ 已启用 Pages 服务
- ✅ 评论系统已配置（可选）
- ✅ 自定义域名已配置（可选）

---

## 后续维护

### 定期更新

```bash
# 更新 Hexo
npm update hexo

# 更新主题
npm update hexo-theme-butterfly

# 更新其他依赖
npm update
```

### 备份建议

- 定期备份文章源码到 GitHub
- 导出配置文件
- 备份图片资源

### 监控建议

- 使用 Google Analytics 或百度统计监控访问量
- 定期检查网站访问状态
- 查看搜索引擎收录情况

---

**祝你部署顺利！如有问题欢迎提 Issue 交流。**