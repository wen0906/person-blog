---
title: 文章详情
date: 2024-01-01 00:00:00
type: "post"
comments: false
aside: false
---

<div id="post-detail-container">
  <div style="text-align: center; padding: 40px; color: #999;">
    <i class="fas fa-spinner fa-pulse" style="font-size: 24px;"></i>
    <p style="margin-top: 16px;">文章加载中...</p>
  </div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    function tryLoad() {
      if (window.BlogAPI && typeof loadPostDetail === 'function') {
        loadPostDetail();
      } else {
        setTimeout(tryLoad, 100);
      }
    }
    tryLoad();
  });
</script>
