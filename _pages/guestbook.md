---
layout: single
title: "留言版"
permalink: /guestbook/
author_profile: true
---

<form class="guestbook-form" id="guestbook-form">
  <label for="guestbook-name">用户名称</label>
  <input id="guestbook-name" name="name" type="text" required maxlength="40" autocomplete="name">

  <label for="guestbook-message">留言内容</label>
  <textarea id="guestbook-message" name="message" required maxlength="500" rows="6"></textarea>

  <button class="btn btn--primary" type="submit">提交留言</button>
</form>

<section class="guestbook-messages" aria-live="polite">
  <h2>留言内容</h2>
  <div id="guestbook-list"></div>
</section>

<script>
(function () {
  var form = document.getElementById('guestbook-form');
  var nameInput = document.getElementById('guestbook-name');
  var messageInput = document.getElementById('guestbook-message');
  var list = document.getElementById('guestbook-list');
  var storageKey = 'liweiningmg_guestbook_messages';

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  function loadMessages() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch (error) {
      return [];
    }
  }

  function saveMessages(messages) {
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }

  function renderMessages() {
    var messages = loadMessages();
    if (!messages.length) {
      list.innerHTML = '<p>暂无留言。</p>';
      return;
    }

    list.innerHTML = messages.map(function (item) {
      return '<article class="guestbook-message">' +
        '<h3>' + escapeHtml(item.name) + '</h3>' +
        '<time>' + escapeHtml(item.time) + '</time>' +
        '<p>' + escapeHtml(item.message).replace(/\n/g, '<br>') + '</p>' +
        '</article>';
    }).join('');
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var name = nameInput.value.trim();
    var message = messageInput.value.trim();

    if (!name || !message) {
      return;
    }

    var messages = loadMessages();
    messages.unshift({
      name: name,
      message: message,
      time: new Date().toLocaleString('zh-CN', { hour12: false })
    });
    saveMessages(messages.slice(0, 50));
    form.reset();
    renderMessages();
  });

  renderMessages();
})();
</script>
