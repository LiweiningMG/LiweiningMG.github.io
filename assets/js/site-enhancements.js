(function () {
  function updateVisitStats() {
    var totalEl = document.getElementById('site-total-visits');
    var todayEl = document.getElementById('site-today-visits');

    if (!totalEl || !todayEl || !window.localStorage) {
      return;
    }

    var today = new Date().toISOString().slice(0, 10);
    var lastCountedDate = localStorage.getItem('liweiningmg_last_counted_date');
    var total = parseInt(localStorage.getItem('liweiningmg_total_visits') || '0', 10);
    var todayKey = 'liweiningmg_today_visits_' + today;
    var todayTotal = parseInt(localStorage.getItem(todayKey) || '0', 10);

    if (lastCountedDate !== today) {
      total += 1;
      todayTotal += 1;
      localStorage.setItem('liweiningmg_total_visits', String(total));
      localStorage.setItem(todayKey, String(todayTotal));
      localStorage.setItem('liweiningmg_last_counted_date', today);
    }

    totalEl.textContent = total;
    todayEl.textContent = todayTotal;
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

  updateVisitStats();
  setupShareButtons();
})();
