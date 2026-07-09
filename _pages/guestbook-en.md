---
layout: single
title: "Guestbook"
permalink: /en/guestbook/
lang: en
translation_url: /guestbook/
author_profile: true
---

Feel free to leave a message here.

<div id="waline"></div>

<link rel="stylesheet" href="https://unpkg.com/@waline/client@v3/dist/waline.css" />

<script type="module">
  import { init } from 'https://unpkg.com/@waline/client@v3/dist/waline.js';

  init({
    el: '#waline',
    serverURL: 'https://comments.liweining.cn',
    lang: 'en',
    path: '/guestbook/',
  });
</script>