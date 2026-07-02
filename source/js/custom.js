// 自定义JavaScript脚本

document.addEventListener('DOMContentLoaded', function() {
  console.log('博客加载完成！');

  addSmoothScroll();
  handleImageError();
  enhanceCodeCopy();
  
  initBlogAPI();
});

async function initBlogAPI() {
  if (!window.BlogAPI) {
    console.warn('BlogAPI 未加载');
    return;
  }

  try {
    await loadCategories();
    await loadTags();
    await loadSiteSettings();
    await loadPosts();
  } catch (error) {
    console.error('API初始化失败:', error);
  }
}

async function loadPosts() {
  const isHomePage = document.querySelector('#recent-posts');
  if (!isHomePage) return;

  try {
    const response = await window.BlogAPI.getPosts({ page: 1, limit: 10 });
    if (response.success && response.data && response.data.list) {
      renderPosts(response.data.list);
    }
  } catch (error) {
    console.error('加载文章列表失败:', error);
  }
}

function renderPosts(posts) {
  const container = document.querySelector('#recent-posts');
  if (!container || posts.length === 0) return;

  const html = posts.map(post => {
    const date = new Date(post.created_at).toLocaleDateString('zh-CN');
    const excerpt = post.excerpt || (post.content || '').replace(/<[^>]+>/g, '').substring(0, 120) + '...';
    const categoryName = post.category_name || '未分类';
    const tagsHtml = (post.tags || []).map(tag =>
      `<a class="article-meta__tags" href="/tags/${encodeURIComponent(tag.name)}/"><span class="tags-punctuation"><i class="fas fa-tag"></i>${tag.name}</span></a>`
    ).join('');

    return `
      <div class="recent-post-item" data-post-id="${post.id}">
        <div class="post_cover">
          <a href="/post/${post.id}.html" title="${post.title}">
            <img class="post_bg" src="/images/default-cover.svg" alt="${post.title}">
          </a>
        </div>
        <div class="recent-post-info">
          <a class="article-title" href="/post/${post.id}.html" title="${post.title}">${post.title}</a>
          <div class="article-meta-wrap">
            <span class="post-meta-date"><i class="far fa-calendar-alt"></i> ${date}</span>
            <span class="article-meta"><span class="article-meta__categories"><a href="/categories/${encodeURIComponent(categoryName)}/">${categoryName}</a></span></span>
            ${tagsHtml ? '<span class="article-meta tags-wrap">' + tagsHtml + '</span>' : ''}
          </div>
          <div class="content">${excerpt}</div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

async function loadCategories() {
  const response = await window.BlogAPI.getCategories();
  if (response.success && response.data) {
    const categories = response.data;
    updateCategoriesWidget(categories);
  }
}

async function loadTags() {
  const response = await window.BlogAPI.getTags();
  if (response.success && response.data) {
    const tags = response.data;
    updateTagsWidget(tags);
  }
}

async function loadSiteSettings() {
  const response = await window.BlogAPI.getSettings();
  if (response.success && response.data) {
    const settings = response.data;
    updateSiteSettings(settings);
  }
}

function updateCategoriesWidget(categories) {
  const categoryWidget = document.querySelector('.card-categories ul');
  if (categoryWidget && categories.length > 0) {
    categoryWidget.innerHTML = categories.map(cat => `
      <li>
        <a href="/categories/${encodeURIComponent(cat.name)}/" class="category-link" data-category-id="${cat.id}">
          ${cat.name}
          <span class="count">${cat.post_count || 0}</span>
        </a>
      </li>
    `).join('');
  }
}

function updateTagsWidget(tags) {
  const tagWidget = document.querySelector('.card-tags');
  if (tagWidget && tags.length > 0) {
    const tagContainer = tagWidget.querySelector('.tag-cloud');
    if (tagContainer) {
      tagContainer.innerHTML = tags.map(tag => `
        <a href="/tags/${encodeURIComponent(tag.name)}/" class="tag-link" data-tag-id="${tag.id}">
          ${tag.name}
          <span class="count">${tag.post_count || 0}</span>
        </a>
      `).join('');
    }
  }
}

function updateSiteSettings(settings) {
  if (settings.site_title) {
    const title = document.querySelector('h1.site-title');
    if (title) title.textContent = settings.site_title.value;
  }
  if (settings.site_subtitle) {
    const subtitle = document.querySelector('.site-subtitle');
    if (subtitle) subtitle.textContent = settings.site_subtitle.value;
  }
}

function addSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

function handleImageError() {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      this.src = '/images/default-cover.svg';
      this.alt = '图片加载失败';
    });
  });
}

function enhanceCodeCopy() {
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const originalText = this.textContent;
      this.textContent = '复制成功！';
      setTimeout(() => {
        this.textContent = originalText;
      }, 2000);
    });
  });
}

function addReadingProgress() {
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(to right, #667eea 0%, #764ba2 100%);
    z-index: 9999;
    transition: width 0.2s ease;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', function() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = progress + '%';
  });
}

console.log('%c 欢迎来到我的博客！', 'color: #667eea; font-size: 24px; font-weight: bold;');
console.log('%c 博客基于 Hexo + Butterfly 搭建', 'color: #764ba2; font-size: 14px;');
console.log('%c 数据来源: 后端API', 'color: #4CAF50; font-size: 14px;');