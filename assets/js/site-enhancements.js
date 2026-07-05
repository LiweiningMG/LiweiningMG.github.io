(function () {
  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function renderHomeGuestbookPreview() {
    var preview = document.getElementById('home-guestbook-preview');
    if (!preview) {
      return;
    }

    preview.innerHTML = '<p class="home-guestbook-empty">' +
      '留言板已升级为 Waline 评论系统，欢迎前往 <a href="/guestbook/">留言板</a> 交流。' +
      '</p>';
  }

  function setupLifeGalleries() {
    document.addEventListener('click', function (event) {
      var card = event.target.closest && event.target.closest('[data-gallery-images]');
      if (!card) {
        return;
      }

      event.preventDefault();
      var title = card.getAttribute('data-gallery-title') || '生活图集';
      var images = (card.getAttribute('data-gallery-images') || '').split('|').filter(Boolean);
      showLifeGallery(title, images);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeLifeGallery();
      }
    });
  }

  function showLifeGallery(title, images) {
    closeLifeGallery();

    if (!images.length) {
      return;
    }

    var dialog = document.createElement('div');
    dialog.className = 'life-gallery-dialog';
    dialog.id = 'life-gallery-dialog';
    dialog.innerHTML = '<div class="life-gallery-dialog__panel" role="dialog" aria-modal="true" aria-label="' + escapeHtml(title) + '">' +
      '<button class="life-gallery-dialog__close" type="button" aria-label="关闭">×</button>' +
      '<header><h2>' + escapeHtml(title) + '</h2><p>点击空白处或按 Esc 关闭</p></header>' +
      '<div class="life-gallery-dialog__grid">' + images.map(function (src, index) {
        return '<figure><img src="' + escapeHtml(src) + '" alt="' + escapeHtml(title) + '照片 ' + (index + 1) + '"></figure>';
      }).join('') + '</div>' +
      '</div>';

    dialog.addEventListener('click', function (event) {
      if (event.target === dialog || event.target.className === 'life-gallery-dialog__close') {
        closeLifeGallery();
      }
    });

    document.body.appendChild(dialog);
  }

  function closeLifeGallery() {
    var existing = document.getElementById('life-gallery-dialog');
    if (existing) {
      existing.remove();
    }
  }

  function setupShareButtons() {
    var buttons = document.querySelectorAll('[data-share-target]');

    Array.prototype.forEach.call(buttons, function (button) {
      button.addEventListener('click', function (event) {
        var target = button.getAttribute('data-share-target');
        var url = button.getAttribute('data-share-url') || window.location.href;
        var title = button.getAttribute('data-share-title') || document.title;

        if (target === 'wechat') {
          event.preventDefault();
          showWechatQr(url);
          return;
        }

        if (target === 'bilibili') {
          event.preventDefault();
          var text = title + ' ' + url;
          if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(function () {
              alert('页面链接已复制。请打开 B站动态或专栏粘贴分享。');
            }, function () {
              window.prompt('复制页面链接后，可在 B站动态或专栏分享：', url);
            });
          } else {
            window.prompt('复制页面链接后，可在 B站动态或专栏分享：', url);
          }
        }
      });
    });
  }

  function showWechatQr(url) {
    var existing = document.getElementById('wechat-share-dialog');
    if (existing) {
      existing.remove();
    }

    var dialog = document.createElement('div');
    var qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' + encodeURIComponent(url);
    dialog.id = 'wechat-share-dialog';
    dialog.className = 'wechat-share-dialog';
    dialog.innerHTML = '<div class="wechat-share-dialog__panel" role="dialog" aria-modal="true" aria-label="分享到微信">' +
      '<button class="wechat-share-dialog__close" type="button" aria-label="关闭">×</button>' +
      '<h2>分享到微信</h2>' +
      '<p>使用微信扫描二维码分享当前页面。</p>' +
      '<img src="' + qrUrl + '" alt="当前页面二维码">' +
      '</div>';

    dialog.addEventListener('click', function (event) {
      if (event.target === dialog || event.target.className === 'wechat-share-dialog__close') {
        dialog.remove();
      }
    });

    document.body.appendChild(dialog);
  }

  renderHomeGuestbookPreview();
  setupLifeGalleries();
  setupShareButtons();
})();
