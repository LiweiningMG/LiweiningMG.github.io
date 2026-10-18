(function () {
  'use strict';
  var english = document.documentElement.lang === 'en';
  var copy = english ? {
    close: 'Close', hint: 'Select a photo to enlarge it. Press Esc to close.',
    back: 'All photos', previous: 'Previous image', next: 'Next image', zoom: 'Zoom image',
    failed: 'Messages are temporarily unavailable.', empty: 'No messages yet. Say hello in the guestbook.',
    visitor: 'Visitor', unavailable: 'Unavailable', guestbook: 'Visit guestbook',
    wechat: 'Share on WeChat', qr: 'Scan this code with WeChat to share the page.',
    copied: 'Link copied. Paste it in a Bilibili post.', copyLink: 'Copy page link',
    imageFailed: 'This photo could not load. Please try again later.'
  } : {
    close: '关闭', hint: '点击照片放大查看，按 Esc 关闭。',
    back: '全部照片', previous: '上一张', next: '下一张', zoom: '放大照片',
    failed: '留言暂时无法读取。', empty: '暂时还没有留言，欢迎来打个招呼。',
    visitor: '访客', unavailable: '暂不可用', guestbook: '去留言板',
    wechat: '分享到微信', qr: '使用微信扫描二维码，分享当前页面。',
    copied: '链接已复制，可粘贴到 B站动态。', copyLink: '复制页面链接',
    imageFailed: '这张照片暂时无法加载，请稍后再试。'
  };
  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char];
    });
  }
  function safeUrl(value) {
    try { var url = new URL(value, location.href); return ['http:', 'https:'].includes(url.protocol) ? url.href : ''; }
    catch (_) { return ''; }
  }
  // Keep basic formatting without letting visitor-supplied markup add active content.
  function commentHtml(value) {
    var holder = document.createElement('div'); holder.innerHTML = value || '';
    var allowed = ['P','BR','STRONG','B','EM','I','A','IMG','CODE','PRE','UL','OL','LI','BLOCKQUOTE'];
    holder.querySelectorAll('script,style,iframe,object,embed,svg,math,form,input,button').forEach(function (node) { node.remove(); });
    Array.from(holder.querySelectorAll('*')).reverse().forEach(function (node) {
      if (!allowed.includes(node.tagName)) { node.replaceWith(document.createTextNode(node.textContent)); return; }
      var href = node.tagName === 'A' ? safeUrl(node.getAttribute('href') || '') : '';
      var src = node.tagName === 'IMG' ? safeUrl(node.getAttribute('src') || '') : '';
      Array.from(node.attributes).forEach(function (attribute) { node.removeAttribute(attribute.name); });
      if (href) { node.setAttribute('href', href); node.setAttribute('rel', 'nofollow noopener noreferrer'); }
      if (src) { node.src = src; node.alt = ''; node.loading = 'lazy'; node.decoding = 'async'; }
      else if (node.tagName === 'IMG') node.remove();
    });
    return holder.innerHTML;
  }
  function timedFetch(url, options) {
    var controller = new AbortController();
    return new Promise(function (resolve, reject) {
      var timer = setTimeout(function () { controller.abort(); reject(new Error('Request timed out')); }, 8000);
      fetch(url, Object.assign({}, options || {}, {signal: controller.signal}))
        .then(function (response) {
          if (!response.ok) throw new Error('Service unavailable');
          return response.json();
        }).then(resolve, reject).finally(function () { clearTimeout(timer); });
    });
  }
  function dateText(value) {
    var date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(english ? 'en-GB' : 'zh-CN', {year:'numeric',month:'2-digit',day:'2-digit'});
  }
  function renderComments() {
    var root = document.getElementById('home-guestbook-preview'); if (!root) return;
    timedFetch('https://comments.liweining.cn/comment?path=/guestbook/&page=1&pageSize=3&sortBy=insertedAt_desc')
      .then(function (payload) {
        var comments = Array.isArray(payload.data) ? payload.data : [];
        if (!comments.length) { root.innerHTML = '<p class="home-guestbook__empty">' + copy.empty + '</p>'; return; }
        root.innerHTML = comments.map(function (item) {
          return '<article class="home-guestbook__message"><div class="home-guestbook__avatar" aria-hidden="true">🌱</div><div><h3>' +
            escapeHtml(item.nick || copy.visitor) + '</h3><div class="home-guestbook__comment">' + commentHtml(item.comment || item.orig || '') +
            '</div><div class="home-guestbook__meta"><span>' + escapeHtml(dateText(item.insertedAt || item.time)) +
            '</span><span>' + Number(item.like || 0) + (english ? ' likes' : ' 个赞') + '</span></div></div></article>';
        }).join('');
      }).catch(function () {
        root.innerHTML = '<p class="home-guestbook__empty">' + copy.failed + ' <a href="' + (english ? '/en/guestbook/' : '/guestbook/') + '">' + copy.guestbook + '</a></p>';
      });
  }
  function renderVisits() {
    var root = document.querySelector('.site-visit-stats[data-site-visit-endpoint]'); if (!root) return;
    var today = root.querySelector('[data-site-visit-today]'); var total = root.querySelector('[data-site-visit-total]');
    // Previewing must not inflate public website statistics.
    var local = ['localhost','127.0.0.1','[::1]'].includes(location.hostname);
    if (local) {
      [today,total].forEach(function (node) { if (node) node.textContent = english ? 'Preview' : '预览'; });
      return;
    }
    timedFetch(root.dataset.siteVisitEndpoint, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({path:location.pathname})})
      .then(function (data) {
        if (!Number.isFinite(Number(data.todayVisitors)) || !Number.isFinite(Number(data.totalVisitors))) throw new Error('Invalid visitor data');
        if (today) today.textContent = Number(data.todayVisitors).toLocaleString();
        if (total) total.textContent = Number(data.totalVisitors).toLocaleString();
      }).catch(function () {
        [today,total].forEach(function (node) { if (node) node.textContent = copy.unavailable; });
      });
  }

  var modalState = null;
  function closeModal() {
    if (!modalState) return;
    var state = modalState; modalState = null;
    state.root.remove();
    state.background.forEach(function (entry) { entry.node.inert = entry.inert; });
    document.body.style.overflow = state.overflow;
    document.body.style.paddingRight = state.paddingRight;
    document.removeEventListener('keydown', modalKeydown);
    if (state.origin && state.origin.isConnected) state.origin.focus({preventScroll:true});
  }
  function focusable(panel) {
    return Array.from(panel.querySelectorAll('button,a[href],input,textarea,select,[tabindex]')).filter(function (node) {
      return !node.disabled && node.tabIndex >= 0 && !node.closest('[hidden]') && node.getClientRects().length;
    });
  }
  function modalKeydown(event) {
    if (!modalState) return;
    if (event.key === 'Escape') { event.preventDefault(); closeModal(); return; }
    if (event.key === 'Tab') {
      var items = focusable(modalState.panel); if (!items.length) { event.preventDefault(); modalState.panel.focus(); return; }
      var first = items[0], last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !modalState.panel.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !modalState.panel.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    }
    if (modalState.move && ['ArrowLeft','ArrowRight'].includes(event.key) && !modalState.viewer.hidden) {
      event.preventDefault(); modalState.move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  }
  function openModal(title, content, origin) {
    closeModal();
    var root = document.createElement('div'); root.id = 'life-gallery-dialog'; root.className = 'life-gallery-dialog';
    root.innerHTML = '<div class="life-gallery-dialog__panel" role="dialog" aria-modal="true" aria-labelledby="gallery-title" tabindex="-1"><header class="gallery-header"><div><h2 id="gallery-title">' +
      escapeHtml(title) + '</h2><p>' + copy.hint + '</p></div><button class="life-gallery-dialog__close" type="button" aria-label="' + copy.close + '">×</button></header>' + content + '</div>';
    var overflow = document.body.style.overflow, paddingRight = document.body.style.paddingRight;
    var background = Array.from(document.body.children).map(function (node) { return {node:node,inert:node.inert}; });
    background.forEach(function (entry) { entry.node.inert = true; });
    var gutter = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
    document.body.style.overflow = 'hidden'; if (gutter) document.body.style.paddingRight = gutter + 'px';
    document.body.appendChild(root);
    modalState = {root:root,panel:root.firstElementChild,origin:origin || document.activeElement,background:background,overflow:overflow,paddingRight:paddingRight};
    root.querySelector('.life-gallery-dialog__close').addEventListener('click',closeModal);
    root.addEventListener('click',function (event) { if (event.target === root) closeModal(); });
    document.addEventListener('keydown',modalKeydown);
    root.querySelector('.life-gallery-dialog__close').focus();
    return root;
  }
  function showGallery(title, images, origin) {
    if (!images.length) return;
    var grid = '<div class="life-gallery-dialog__grid">' + images.map(function (src,index) {
      return '<button type="button" class="gallery-thumbnail" data-photo-index="' + index + '" aria-label="' + (english ? 'View photo ' : '查看照片 ') + (index+1) +
        '"><img loading="lazy" decoding="async" src="' + escapeHtml(src) + '" alt="' + escapeHtml(title) + ' ' + (index+1) + '"><span>' + (index+1) + '</span></button>';
    }).join('') + '</div>';
    var viewer = '<section class="gallery-viewer" hidden><div class="gallery-toolbar"><button type="button" data-gallery-back>' + copy.back +
      '</button><span data-photo-counter aria-live="polite"></span><button type="button" data-gallery-zoom aria-label="' + copy.zoom +
      '" aria-pressed="false">＋</button></div><div class="gallery-image-stage"><button class="gallery-arrow" type="button" data-gallery-prev aria-label="' + copy.previous +
      '">‹</button><div class="gallery-image-scroll"><img decoding="async" alt=""><p class="gallery-image-error" hidden>' + copy.imageFailed +
      '</p></div><button class="gallery-arrow" type="button" data-gallery-next aria-label="' + copy.next + '">›</button></div></section>';
    var root = openModal(title,grid+viewer,origin), index = 0;
    var overview = root.querySelector('.life-gallery-dialog__grid'), detail = root.querySelector('.gallery-viewer');
    var image = detail.querySelector('img'), zoom = detail.querySelector('[data-gallery-zoom]');
    function displayPhoto(next) {
      index = (next + images.length) % images.length;
      detail.classList.remove('is-zoomed'); zoom.setAttribute('aria-pressed','false');
      detail.querySelector('.gallery-image-error').hidden = true; image.hidden = false;
      image.src = images[index]; image.alt = title + ' ' + (index+1);
      detail.querySelector('[data-photo-counter]').textContent = (index+1) + ' / ' + images.length;
    }
    image.addEventListener('error',function () { image.hidden=true; detail.querySelector('.gallery-image-error').hidden=false; });
    root.querySelectorAll('[data-photo-index]').forEach(function (button) {
      button.addEventListener('click',function () { overview.hidden=true; detail.hidden=false; displayPhoto(Number(button.dataset.photoIndex)); detail.querySelector('[data-gallery-back]').focus(); });
    });
    detail.querySelector('[data-gallery-back]').addEventListener('click',function () { detail.hidden=true; overview.hidden=false; overview.querySelector('[data-photo-index="' + index + '"]').focus(); });
    detail.querySelector('[data-gallery-prev]').addEventListener('click',function () { displayPhoto(index-1); });
    detail.querySelector('[data-gallery-next]').addEventListener('click',function () { displayPhoto(index+1); });
    zoom.addEventListener('click',function () { var active=zoom.getAttribute('aria-pressed')!=='true'; zoom.setAttribute('aria-pressed',String(active)); detail.classList.toggle('is-zoomed',active); });
    modalState.viewer=detail; modalState.move=function (direction) { displayPhoto(index+direction); };
  }
  document.addEventListener('click',function (event) {
    var card=event.target.closest('[data-gallery-images]'); if (!card) return;
    event.preventDefault(); showGallery(card.dataset.galleryTitle || (english?'Photo gallery':'生活图集'),card.dataset.galleryImages.split('|').filter(Boolean),card);
  });
  // Original photo links stay usable when scripts are disabled.
  document.querySelectorAll('.home-collage__item img, .home-photo-strip img, .life-photo img').forEach(function (img) {
    var anchor = document.createElement('a'); anchor.className='photo-preview-link'; anchor.href=img.getAttribute('src');
    anchor.dataset.galleryImages=img.getAttribute('src'); anchor.dataset.galleryTitle=img.alt;
    anchor.setAttribute('aria-label',(english?'Enlarge photo: ':'放大照片：')+img.alt);
    img.replaceWith(anchor); anchor.appendChild(img);
  });
  document.querySelectorAll('.page__content > p a[href]').forEach(function (link) {
    if (/\.(jpe?g|png|webp)$/i.test(link.getAttribute('href'))) {
      link.dataset.galleryImages=link.getAttribute('href'); link.dataset.galleryTitle=link.textContent || (english?'Photo':'照片');
    }
  });
  document.querySelectorAll('[data-share-target]').forEach(function (button) {
    button.addEventListener('click',function (event) {
      var target=button.dataset.shareTarget, url=button.dataset.shareUrl || location.href;
      if (target==='wechat') {
        event.preventDefault();
        var root=openModal(copy.wechat,'<p>'+copy.qr+'</p><img class="share-qr" src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&amp;data='+encodeURIComponent(url)+'" alt="'+copy.wechat+'"><p><a href="'+escapeHtml(url)+'">'+escapeHtml(url)+'</a></p>',button);
        root.querySelector('.gallery-header p').textContent='';
      }
      if (target==='bilibili') {
        event.preventDefault(); var text=(button.dataset.shareTitle || document.title)+' '+url;
        if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { alert(copy.copied); }).catch(function () { prompt(copy.copyLink,text); });
        else prompt(copy.copyLink,text);
      }
    });
  });
  renderComments();
  renderVisits();
})();
