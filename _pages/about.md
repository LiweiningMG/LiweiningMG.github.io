---
permalink: /
lang: zh
translation_url: /en/
show_title: false
title: "首页"
description: "李伟宁的个人网站：动物育种研究与技术工作，以及运动、烹饪和认真生活的日常。"
author_profile: false
classes: wide
redirect_from:
  - /about/
  - /about.html
---

<section class="home-landing">
  <div class="home-hero">
    <div class="home-hero__copy">
      <p class="home-eyebrow">工作与生活，都认真一点</p><h1>你好，我是李伟宁。</h1>
      <p class="home-hero__intro">从事动物育种研究与技术工作。离开电脑，喜欢运动、下厨，也爱动手解决生活里的小问题。</p>

      <div class="home-hero__meta" aria-label="当前身份和研究方向">
        {% include profile-roles.html compact=true %}
      </div>

      <div class="home-actions">
        <a class="home-button home-button--primary" href="/cv/">个人简历</a>
        <a class="home-button" href="/publications/">学术成果</a>
        <a class="home-button" href="/teaching/">教程文章</a>
      </div>
    </div>

    <div class="home-collage" aria-label="个人照片拼贴">
      <figure class="home-collage__item home-collage__item--main">
        <img fetchpriority="high" loading="eager" decoding="async" class="home-collage__photo home-collage__photo--main" src="/images/optimized/thumbs/home-shunyi-farm.webp" alt="饲喂实验时和饲喂笼里的猪对视">
        <figcaption class="home-collage__caption">瞅我干啥？瞅你咋地！</figcaption>
      </figure>
      <figure class="home-collage__item home-collage__item--top">
        <img loading="lazy" fetchpriority="low" decoding="async" class="home-collage__photo home-collage__photo--small" src="/images/optimized/thumbs/personal-life/badminton-2.webp" alt="农科院羽毛球赛起跳杀球照片">
        <figcaption class="home-collage__caption">跳是跳了，球随缘吧</figcaption>
      </figure>
      <figure class="home-collage__item home-collage__item--bottom">
        <img loading="lazy" fetchpriority="low" decoding="async" class="home-collage__photo home-collage__photo--small" src="/images/optimized/thumbs/personal-life/food-cn-11.webp" alt="小马生肖模具制作的月饼">
        <figcaption class="home-collage__caption">小马送福，马到成功</figcaption>
      </figure>
    </div>
  </div>

  <section class="home-section">
    <div class="home-section__heading">
      <h2>主要成果</h2>
      <a href="/publications/">全部成果</a>
    </div>
    {% include publication-cards.html compact=true %}
  </section>

  <section class="home-section home-section--moments">
    <div class="home-section__heading">
      <h2>生活切片</h2>
      <a href="/personal-life/">进入个人生活</a>
    </div>

    <div class="home-moment-group home-moment-group--sport">
      <div class="home-moment-group__label">
        <span>运动</span>
        <p>跑步、球类和骑行，把身体先叫醒</p>
      </div>
      <div class="home-photo-strip">
        <img loading="lazy" decoding="async" src="/images/optimized/thumbs/personal-life/running-total.webp" alt="跑步总里程记录">
        <img loading="lazy" decoding="async" src="/images/optimized/thumbs/personal-life/pingpong.webp" alt="乒乓球活动">
        <img loading="lazy" decoding="async" src="/images/optimized/thumbs/personal-life/badminton.webp" alt="羽毛球活动">
      </div>
    </div>

    <div class="home-moment-group home-moment-group--food">
      <div class="home-moment-group__label">
        <span>美食</span>
        <p>会吃，也愿意花时间把饭做好</p>
      </div>
      <div class="home-photo-strip">
        <img loading="lazy" decoding="async" src="/images/optimized/thumbs/personal-life/cooking-cn.webp" alt="中餐菜品">
        <img loading="lazy" decoding="async" src="/images/optimized/thumbs/personal-life/baking.webp" alt="烘焙或西餐">
        <img loading="lazy" decoding="async" src="/images/optimized/thumbs/Toast-500x300.webp" alt="烘焙照片">
      </div>
    </div>

    <div class="home-moment-group home-moment-group--travel">
      <div class="home-moment-group__label">
        <span>旅行</span>
        <p>走出去看风景，也给日常换个空气</p>
      </div>
      <div class="home-photo-strip">
        <img loading="lazy" fetchpriority="low" decoding="async" src="/images/optimized/thumbs/home-page-2.webp" alt="旅行照片一">
        <img loading="lazy" fetchpriority="low" decoding="async" src="/images/optimized/thumbs/home-page-4.webp" alt="旅行照片二">
        <img loading="lazy" fetchpriority="low" decoding="async" src="/images/optimized/thumbs/home-page-5.webp" alt="旅行照片三">
      </div>
    </div>
  </section>

  <section class="home-quote">
    <blockquote>
      <p>“Life is like riding a bicycle. To keep your balance, you must keep moving”</p>
      <cite>Albert Einstein</cite>
    </blockquote>
    <p>最近大概就是这样：继续做事，继续学习，继续往前走</p>
  </section>

  <section class="home-guestbook" aria-labelledby="home-guestbook-title">
    <div class="home-guestbook__intro">
      <div class="home-guestbook__icon" aria-hidden="true">•••</div>
      <h2 id="home-guestbook-title">留言板</h2>
      <p>路过这里的话，欢迎留下一句问候、建议，或分享最近的小确幸。</p>
      <div class="home-guestbook__decoration" aria-hidden="true"></div>
    </div>

    <div class="home-guestbook__latest">
      <div class="home-guestbook__eyebrow">最新留言</div>
      <div class="home-guestbook__messages" id="home-guestbook-preview" aria-live="polite">
        <p class="home-guestbook__empty">正在读取最近留言...</p>
      </div>
    </div>

    <a class="home-guestbook__button" href="/guestbook/">去留言板</a>
  </section>
</section>
