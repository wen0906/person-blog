# 个人博客

一个基于 Hexo + Butterfly 主题搭建的简洁优雅的个人博客系统。

## 项目简介

本项目是一个轻量化、易部署、高稳定、可拓展的个人博客网站，采用静态博客方案，支持多种免费部署方式。

### 核心特性

- **极简部署**：支持 GitHub Pages、Vercel 一键部署，零基础用户也能快速上线
- **性能优异**：页面秒开、按需加载，适配移动端自适应
- **功能实用**：聚焦博客核心能力，支持分类、标签、搜索、评论等功能
- **高度可定制**：主题样式、模块布局、功能开关可自由配置
- **长期稳定**：数据本地存储+云端备份，适配主流服务器与托管平台

### 技术栈

- **核心框架**：Hexo 7.3.0
- **主题模板**：Butterfly 5.3.2
- **写作格式**：Markdown
- **构建环境**：Node.js 18+
- **部署平台**：GitHub Pages / Vercel（免费）
- **评论系统**：Giscus（基于 GitHub Discussions，免费）

## 目录结构

```
blog-project/
├── source/                # 核心源码目录
│   ├── _posts/            # 博客文章存储目录
│   ├── _drafts/           # 草稿文章目录
│   ├── about/             # 关于页面
│   ├── tags/              # 标签页面
│   ├── categories/        # 分类页面
│   ├── friends/            # 友链页面
│   ├── css/               # 自定义样式
│   ├── js/                # 自定义脚本
│   └── images/            # 本地图片资源
├── themes/                # 主题模板目录
├── scaffolds/             # 文章模板
├── public/                # 构建后静态资源目录
├── _config.yml            # 博客全局配置文件
├── _config.butterfly.yml  # Butterfly主题配置文件
├── package.json           # 依赖配置
├── .github/workflows/     # GitHub Actions自动部署
├── vercel.json            # Vercel部署配置
└── README.md              # 项目说明文档
```

## 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- Git

### 本地开发

1. **克隆项目**

```bash
git clone https://github.com/yourusername/your-blog-repo.git
cd your-blog-repo
```

2. **安装依赖**

```bash
npm install
```

3. **本地预览**

```bash
npm run server
```

访问 http://localhost:4000 查看博客效果。

4. **创建新文章**

```bash
npx hexo new "文章标题"
```

5. **创建新页面**

```bash
npx hexo new page "页面名称"
```

6. **生成静态文件**

```bash
npm run build
```

## 部署方式

本项目支持多种免费部署方式，您可以根据需求选择：

### 方式一：GitHub Pages 部署（推荐）

**优点**：完全免费、永久托管、无需服务器、自动更新

**步骤**：

1. Fork 本项目到你的 GitHub 账号

2. 修改配置文件
   - 编辑 `_config.yml`，修改 `url` 和 `deploy.repo` 为你的仓库地址
   - 编辑 `_config.butterfly.yml`，配置 Giscus 评论系统（可选）

3. 启用 GitHub Pages
   - 进入仓库的 Settings → Pages
   - 选择 `gh-pages` 分支作为部署源
   - 等待几分钟后即可访问

4. 自动部署
   - 项目已配置 GitHub Actions 自动部署
   - 每次推送到 `main` 分支会自动构建并部署到 `gh-pages` 分支

**访问地址**：`https://yourusername.github.io/仓库名/`

### 方式二：Vercel 部署

**优点**：部署最快、全球访问流畅、免费流量充足、自动更新

**步骤**：

1. Fork 本项目到你的 GitHub 账号

2. 登录 [Vercel](https://vercel.com/) 平台

3. 点击 "New Project"，导入你的 GitHub 仓库

4. Vercel 会自动检测 Hexo 项目并配置构建命令

5. 点击 "Deploy"，等待几分钟即可完成部署

6. 绑定自定义域名（可选）
   - 在 Vercel 项目设置中添加自定义域名
   - 在域名服务商处配置 DNS 解析

**访问地址**：Vercel 会提供一个免费的 `.vercel.app` 域名

### 方式三：Cloudflare Pages 部署

**优点**：全球CDN加速、免费无限流量、自动HTTPS

**步骤**：

1. Fork 本项目到你的 GitHub 账号

2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)

3. 进入 Pages → Create a project → Connect to Git

4. 选择你的 GitHub 仓库

5. 配置构建设置：
   - 构建命令：`npm run build`
   - 输出目录：`public`

6. 点击 "Save and Deploy"

**访问地址**：Cloudflare 会提供一个免费的 `.pages.dev` 域名

## 配置说明

### 博客配置（_config.yml）

主要配置项：

```yaml
# 网站基础配置
title: 我的个人博客
subtitle: 记录生活，分享技术
description: 一个简洁优雅的个人博客
author: 你的名字
language: zh-CN

# URL配置
url: https://yourusername.github.io
root: /

# 主题
theme: butterfly

# 部署配置
deploy:
  type: git
  repo: https://github.com/yourusername/yourusername.github.io.git
  branch: main
```

### 主题配置（_config.butterfly.yml）

Butterfly 主题配置文件，包括：

- 导航菜单
- 社交链接
- 评论系统（Giscus）
- 搜索功能
- 访问统计
- 暗黑模式
- 自定义样式

详细配置请查看 [_config.butterfly.yml](_config.butterfly.yml) 文件。

### Giscus 评论配置

本项目使用 Giscus 作为评论系统，基于 GitHub Discussions，完全免费。

**配置步骤**：

1. 确保 GitHub 仓库已启用 Discussions 功能
   - 进入仓库 Settings → Features → 勾选 Discussions

2. 访问 [Giscus](https://giscus.app/zh-CN) 配置页面

3. 按照页面提示配置：
   - 输入仓库地址
   - 选择页面 ↔️ discussions 映射关系
   - 选择 Discussion 分类
   - 复制生成的配置信息

4. 将配置信息填入 `_config.butterfly.yml` 中的 `giscus` 部分

## 写作指南

### 创建文章

```bash
npx hexo new "文章标题"
```

文章会创建在 `source/_posts/` 目录下。

### 文章格式

```markdown
---
title: 文章标题
date: 2024-01-01 00:00:00
categories:
  - 分类名称
tags:
  - 标签1
  - 标签2
top_img: /images/cover.jpg
cover: /images/cover.jpg
---

文章内容...
```

### 文章属性

- `title`：文章标题
- `date`：发布日期
- `categories`：分类（支持多级分类）
- `tags`：标签
- `top_img`：文章顶部封面图
- `cover`：文章列表封面图
- `abbrlink`：文章短链接（自动生成）

### 创建页面

```bash
npx hexo new page "页面名称"
```

页面会创建在 `source/页面名称/` 目录下。

### 草稿功能

创建草稿：

```bash
npx hexo new draft "草稿标题"
```

草稿保存在 `source/_drafts/` 目录，不会被构建到网站中。

预览草稿：

```bash
npx hexo server --draft
```

发布草稿：

```bash
npx hexo publish "草稿标题"
```

## 常用命令

```bash
# 安装依赖
npm install

# 本地预览
npm run server
# 或
npx hexo server

# 生成静态文件
npm run build
# 或
npx hexo generate

# 清理缓存
npm run clean
# 或
npx hexo clean

# 部署到远程仓库
npm run deploy
# 或
npx hexo deploy

# 创建新文章
npx hexo new "文章标题"

# 创建新页面
npx hexo new page "页面名称"

# 创建草稿
npx hexo new draft "草稿标题"

# 发布草稿
npx hexo publish "草稿标题"
```

## 功能特色

### 1. 响应式设计

博客完美适配各种设备，包括桌面端、平板和移动端。

### 2. 暗黑模式

支持亮色/暗黑模式一键切换，并可自动跟随系统设置。

### 3. 全站搜索

集成本地搜索功能，支持搜索文章标题、内容和标签。

### 4. 评论系统

集成 Giscus 评论系统，基于 GitHub Discussions，完全免费稳定。

### 5. 文章统计

显示文章字数、阅读时长，以及全站访问量统计。

### 6. RSS订阅

自动生成 RSS 订阅文件，方便读者订阅博客更新。

### 7. SEO优化

自动生成 sitemap，优化搜索引擎收录。

### 8. 代码高亮

支持多种编程语言的语法高亮，支持一键复制代码。

### 9. 图片懒加载

图片懒加载优化，提升页面加载速度。

### 10. 文章加密

支持文章加密功能，保护隐私内容。

## 常见问题

### Q1: 如何修改博客名称和作者信息？

编辑 `_config.yml` 文件，修改 `title`、`subtitle`、`author` 等字段。

### Q2: 如何添加新的导航菜单？

编辑 `_config.butterfly.yml` 文件，在 `menu` 部分添加新的菜单项。

### Q3: 如何更换主题？

1. 安装新主题：`npm install hexo-theme-主题名`
2. 修改 `_config.yml` 中的 `theme` 字段为主题名称

### Q4: 如何添加自定义域名？

在域名服务商处配置 DNS 解析，指向 GitHub Pages 或 Vercel 提供的地址。

### Q5: 如何配置评论系统？

参考本文档的"Giscus 评论配置"章节进行配置。

### Q6: 如何添加友情链接？

在 `source/friends/index.md` 文件中添加友链信息。

### Q7: 部署后页面样式错乱怎么办？

检查 `_config.yml` 中的 `root` 配置是否正确：
- 部署在根目录（yourusername.github.io）：`root: /`
- 部署在子目录：`root: /仓库名/`

### Q8: 如何添加自定义CSS/JS？

将自定义 CSS 放在 `source/css/custom.css`，自定义 JS 放在 `source/js/custom.js`。

## 更新日志

### v1.0.0 (2024-01-01)

- 完成基础博客功能
- 集成 Butterfly 主题
- 配置 GitHub Pages 自动部署
- 支持 Vercel 部署
- 集成 Giscus 评论系统
- 添加全站搜索功能
- 添加 RSS 订阅功能
- 支持 SEO 优化
- 支持暗黑模式

## 技术支持

- Hexo 文档：https://hexo.io/zh-cn/docs/
- Butterfly 主题文档：https://butterfly.js.org/
- Giscus 配置：https://giscus.app/zh-CN

## 开源协议

本项目采用 MIT 协议开源。

## 致谢

- [Hexo](https://hexo.io/) - 快速、简洁且高效的博客框架
- [Butterfly](https://butterfly.js.org/) - 优雅的 Hexo 主题
- [GitHub Pages](https://pages.github.com/) - 免费的静态网站托管服务
- [Vercel](https://vercel.com/) - 现代化的前端部署平台

---

感谢使用本项目搭建博客！如有问题欢迎提Issue交流。