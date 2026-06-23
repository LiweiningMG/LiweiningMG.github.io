---
layout: single
title: "留言板"
permalink: /guestbook/
author_profile: true
---

欢迎在这里留言交流。

<div id="waline"></div>

<link
  rel="stylesheet"
  href="https://unpkg.com/@waline/client@v3/dist/waline.css"
/>

<script type="module">
  import { init } from 'https://unpkg.com/@waline/client@v3/dist/waline.js';

  init({
    el: '#waline',
    serverURL: 'https://comments.liweining.cn',
    lang: 'zh-CN',
    path: '/guestbook/',
  });
</script>
