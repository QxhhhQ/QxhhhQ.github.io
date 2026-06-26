'use strict';

const applyChineseThemeText = () => {
  const theme = hexo.theme && hexo.theme.config;
  if (!theme) return;

  // Hexo deep-merges theme menus, so replace the final menu object before rendering.
  theme.menu = {
    '首页': '/',
    '归档': '/archives/'
  };
  theme.widgets = ['category', 'tag', 'tagcloud', 'archive', 'recent_posts'];

  theme.excerpt_link = '阅读全文';

  if (theme.valine) {
    theme.valine.placeholder = '欢迎留言';
  }

  const zhCN = {
    ...hexo.theme.i18n.get('zh-CN'),
    powered_by: '基于',
    rss_feed: '订阅源'
  };

  hexo.theme.i18n.set('zh-CN', zhCN);
};

hexo.on('generateBefore', applyChineseThemeText);

const codeCopyAssets = `
<style>
.highlight,
.article-entry pre {
  position: relative;
}

.code-copy-button {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  border: 0;
  border-radius: 4px;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  font-size: 12px;
  line-height: 1.4;
  cursor: pointer;
}

.code-copy-button:hover {
  background: rgba(0, 0, 0, 0.82);
}

.article-entry hr {
  margin: 48px 0;
  border: 0;
  border-top: 1px solid #ddd;
}
</style>
<script>
(function () {
  function getCodeText(block) {
    var code = block.querySelector('.code pre') || block.querySelector('pre') || block;
    return code.innerText.replace(/\\n$/, '');
  }

  function addCopyButton(block) {
    if (block.querySelector('.code-copy-button')) return;

    var button = document.createElement('button');
    button.className = 'code-copy-button';
    button.type = 'button';
    button.textContent = '复制';
    button.addEventListener('click', function () {
      navigator.clipboard.writeText(getCodeText(block)).then(function () {
        button.textContent = '已复制';
        setTimeout(function () {
          button.textContent = '复制';
        }, 1200);
      });
    });
    block.appendChild(button);
  }

  document.querySelectorAll('figure.highlight, .article-entry > pre').forEach(addCopyButton);
})();
</script>`;

const clickParticleAssets = `
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js"></script>
<script>
(function () {
  var lastBurstAt = 0;
  var colors = ['#1f8fff', '#f9c74f', '#ef476f', '#06d6a0', '#8338ec'];

  document.addEventListener('click', function (event) {
    if (typeof window.confetti !== 'function') return;

    var now = Date.now();
    if (now - lastBurstAt < 80) return;
    lastBurstAt = now;

    var origin = {
      x: event.clientX / window.innerWidth,
      y: event.clientY / window.innerHeight
    };

    window.confetti({
      particleCount: 38,
      spread: 64,
      startVelocity: 28,
      ticks: 120,
      gravity: 0.9,
      scalar: 0.72,
      colors: colors,
      origin: origin,
      disableForReducedMotion: true
    });
  });
})();
</script>`;

hexo.extend.filter.register('_after_html_render', html => {
  const localized = html.replace(
    /基于 <a href="https:\/\/hexo\.io\/" target="_blank">Hexo<\/a>/g,
    '呵货科技'
  );

  const assets = [];
  if (!localized.includes('code-copy-button')) assets.push(codeCopyAssets);
  if (!localized.includes('confetti.browser.min.js')) assets.push(clickParticleAssets);
  if (!assets.length) return localized;

  return localized.replace('</body>', `${assets.join('\n')}\n</body>`);
});
