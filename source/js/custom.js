// 自定义JavaScript脚本

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  console.log('博客加载完成！');

  // 添加平滑滚动
  addSmoothScroll();

  // 添加图片懒加载错误处理
  handleImageError();

  // 添加复制代码功能增强
  enhanceCodeCopy();
});

// 平滑滚动
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

// 图片加载错误处理
function handleImageError() {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      this.src = '/images/default-cover.jpg';
      this.alt = '图片加载失败';
    });
  });
}

// 增强代码复制功能
function enhanceCodeCopy() {
  // 为代码块添加复制成功提示
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

// 添加阅读进度条（可选）
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

// 调用阅读进度条
// addReadingProgress();

// 控制台欢迎信息
console.log('%c 欢迎来到我的博客！', 'color: #667eea; font-size: 24px; font-weight: bold;');
console.log('%c 博客基于 Hexo + Butterfly 搭建', 'color: #764ba2; font-size: 14px;');