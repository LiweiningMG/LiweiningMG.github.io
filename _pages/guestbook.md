---
layout: single
title: "留言板"
permalink: /guestbook/
lang: zh
translation_url: /en/guestbook/
author_profile: true
---

欢迎在这里留言交流。

留言采用审核后公开机制，新留言提交后可能不会立即显示。请勿发布违法违规、侵权、广告、骚扰、攻击性或不适宜公开展示的内容。站长保留删除不当留言的权利。留言和访问统计相关信息处理方式可见 [隐私说明](/privacy/)。

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
