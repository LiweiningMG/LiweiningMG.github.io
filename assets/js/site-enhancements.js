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

  function sanitizeCommentHtml(comment) {
    var holder = document.createElement('div');
    holder.innerHTML = comment || '';

    Array.prototype.forEach.call(holder.querySelectorAll('script, iframe, style, object, embed'), function (node) {
      node.remove();
    });

    Array.prototype.forEach.call(holder.querySelectorAll('*'), function (node) {
      Array.prototype.slice.call(node.attributes).forEach(function (attr) {
        var name = attr.name.toLowerCase();
        var value = attr.value || '';

        if (name.indexOf('on') === 0) {
          node.removeAttribute(attr.name);
          return;
        }

        if ((name === 'href' || name === 'src') && /^javascript:/i.test(value.trim())) {
          node.removeAttribute(attr.name);
        }
      });
    });

    Array.prototype.forEach.call(holder.querySelectorAll('img'), function (img) {
      var src = img.getAttribute('src') || '';
      if (src.indexOf('//') === 0) {
        img.setAttribute('src', 'https:' + src);
      }
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
      if (!img.getAttribute('alt')) {
        img.setAttribute('alt', '');
      }
    });

    return holder.innerHTML;
  }

  function formatCommentDate(value) {
    var date = value ? new Date(value) : null;
    if (!date || Number.isNaN(date.getTime())) {
      return '';
    }
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return year + '/' + month + '/' + day;
  }

  function withLocalGuestbookSamples(comments) {
    var isLocalPreview = ['127.0.0.1', 'localhost'].indexOf(window.location.hostname) !== -1;
    if (!isLocalPreview || comments.length >= 3) {
      return comments;
    }

    return comments.concat([
      {
        nick: '朋友 A',
        comment: '<p>网站越来越有生活气了，路过打个招呼。</p>',
        insertedAt: '2026-06-22T10:30:00.000Z',
        like: 1
      },
      {
        nick: '朋友 B',
        comment: '<p>祝科研顺利，也祝厨房继续高产。</p>',
        insertedAt: '2026-06-21T08:00:00.000Z',
        like: 0
      }
    ]).slice(0, 3);
  }

  function renderHomeGuestbookPreview() {
    var preview = document.getElementById('home-guestbook-preview');
    if (!preview) {
      return;
    }

    var endpoint = 'https://comments.liweining.cn/comment?path=/guestbook/&page=1&pageSize=3&sortBy=insertedAt_desc';
    preview.innerHTML = '<p class="home-guestbook__empty">正在读取最近留言...</p>';

    fetch(endpoint)
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Waline request failed');
        }
        return response.json();
      })
      .then(function (payload) {
        var comments = withLocalGuestbookSamples(Array.isArray(payload.data) ? payload.data : []);
        if (!comments.length) {
          preview.innerHTML = '<p class="home-guestbook__empty">暂无留言，欢迎来留言板坐坐</p>';
          return;
        }

        preview.innerHTML = comments.map(function (item) {
          var html = sanitizeCommentHtml(item.comment || item.orig || '');
          var nick = item.nick || '访客';
          var date = formatCommentDate(item.insertedAt || item.time);
          var like = Number(item.like || 0);
          return '<article class="home-guestbook__message">' +
            '<div class="home-guestbook__avatar" aria-hidden="true">🌱</div>' +
            '<div>' +
            '<h3>' + escapeHtml(nick) + '</h3>' +
            '<p>' + (html || escapeHtml('留下了一条留言')) + '</p>' +
            '<div class="home-guestbook__meta">' +
            '<span>' + escapeHtml(date) + '</span>' +
            '<span>' + (like ? like + ' 个赞' : '欢迎') + '</span>' +
            '</div>' +
            '</div>' +
            '</article>';
        }).join('');
      })
      .catch(function () {
        preview.innerHTML = '<p class="home-guestbook__empty">暂时没有读取到留言，可前往 <a href="/guestbook/">留言板</a> 查看</p>';
      });
  }



  function setupDeferredImages() {
    var images = Array.prototype.slice.call(document.querySelectorAll('img[data-lazy-src]'));
    if (!images.length) {
      return;
    }

    function loadImage(img) {
      var src = img.getAttribute('data-lazy-src');
      if (!src) {
        return;
      }
      img.src = src;
      img.removeAttribute('data-lazy-src');
      img.classList.remove('is-deferred-image');
    }

    images.forEach(function (img) {
      img.classList.add('is-deferred-image');
    });

    if (!('IntersectionObserver' in window)) {
      images.forEach(loadImage);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          loadImage(entry.target);
        }
      });
    }, { rootMargin: '180px 0px' });

    images.forEach(function (img) {
      observer.observe(img);
    });
  }
  function renderSiteVisitStats() {
    var root = document.querySelector('.site-visit-stats[data-site-visit-endpoint]');
    if (!root || !window.fetch) {
      return;
    }

    var endpoint = root.getAttribute('data-site-visit-endpoint');
    var todayNode = root.querySelector('[data-site-visit-today]');
    var totalNode = root.querySelector('[data-site-visit-total]');

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: window.location.pathname })
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Visit stats request failed');
        }
        return response.json();
      })
      .then(function (data) {
        if (todayNode) {
          todayNode.textContent = Number(data.todayVisitors || 0).toLocaleString();
        }
        if (totalNode) {
          totalNode.textContent = Number(data.totalVisitors || 0).toLocaleString();
        }
      });
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
        return '<figure><img loading="lazy" decoding="async" src="' + escapeHtml(src) + '" alt="' + escapeHtml(title) + '照片 ' + (index + 1) + '"></figure>';
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

  setupDeferredImages();
  renderHomeGuestbookPreview();
  renderSiteVisitStats();
  setupLifeGalleries();
  setupShareButtons();
})();
