---
layout: single
title: "Guestbook"
permalink: /en/guestbook/
lang: en
translation_url: /guestbook/
author_profile: true
---

Feel free to leave a message here.

Messages are published after moderation, so a new message may not appear immediately. Please do not post illegal, infringing, advertising, harassing, abusive, offensive, or otherwise inappropriate content. The site owner reserves the right to delete inappropriate messages. See the [Privacy Notice](/en/privacy/) for how guestbook and visitor-statistics information is handled.

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