---
permalink: /en/
lang: en
translation_url: /
show_title: false
title: "Home"
description: "Research and technical work in animal breeding, alongside sports, cooking, and everyday life."
author_profile: false
classes: wide
---

<section class="home-landing">
  <div class="home-hero">
    <div class="home-hero__copy">
      <p class="home-eyebrow">RESEARCH & EVERYDAY LIFE</p><h1>Hello, I’m Weining.</h1>
      <p class="home-hero__intro">I work in animal breeding research and technical consulting. Away from the desk, you’ll find me playing sports, cooking, or figuring out how to fix something.</p>

      <div class="home-hero__meta" aria-label="Current roles and research interests">
        {% include profile-roles.html compact=true %}
      </div>

      <div class="home-actions">
        <a class="home-button home-button--primary" href="/en/cv/">CV</a>
        <a class="home-button" href="/en/publications/">Research</a>
        <a class="home-button" href="/en/teaching/">Tutorials</a>
      </div>
    </div>

    <div class="home-collage" aria-label="Photo collage">
      <figure class="home-collage__item home-collage__item--main">
        <img fetchpriority="high" loading="eager" decoding="async" class="home-collage__photo home-collage__photo--main" src="/images/optimized/thumbs/home-shunyi-farm.webp" alt="Eye contact with a pig during a feeding experiment">
        <figcaption class="home-collage__caption">Eye contact with the real boss.</figcaption>
      </figure>
      <figure class="home-collage__item home-collage__item--top">
        <img loading="lazy" fetchpriority="low" decoding="async" class="home-collage__photo home-collage__photo--small" src="/images/optimized/thumbs/personal-life/badminton-2.webp" alt="Jump smash at the JAAS badminton tournament">
        <figcaption class="home-collage__caption">Up I went, off it flew.</figcaption>
      </figure>
      <figure class="home-collage__item home-collage__item--bottom">
        <img loading="lazy" fetchpriority="low" decoding="async" class="home-collage__photo home-collage__photo--small" src="/images/optimized/thumbs/personal-life/food-cn-11.webp" alt="Pony-shaped mooncake made with a zodiac mold">
        <figcaption class="home-collage__caption">A pony wish for a winning year.</figcaption>
      </figure>
    </div>
  </div>

  <section class="home-section">
    <div class="home-section__heading">
      <h2>Main Research</h2>
      <a href="/en/publications/">All publications</a>
    </div>
    {% include publication-cards.html compact=true %}
  </section>

  <section class="home-section home-section--moments">
    <div class="home-section__heading">
      <h2>Life in snapshots</h2>
      <a href="/en/personal-life/">Personal life</a>
    </div>

    <div class="home-moment-group home-moment-group--sport">
      <div class="home-moment-group__label"><span>Sports</span><p>Running, ball games, and cycling wake the body up first</p></div>
      <div class="home-photo-strip">
        <img loading="lazy" decoding="async" src="/images/optimized/thumbs/personal-life/running-total.webp" alt="Running mileage record">
        <img loading="lazy" decoding="async" src="/images/optimized/thumbs/personal-life/pingpong.webp" alt="Table tennis photo">
        <img loading="lazy" decoding="async" src="/images/optimized/thumbs/personal-life/badminton.webp" alt="Badminton photo">
      </div>
    </div>

    <div class="home-moment-group home-moment-group--food">
      <div class="home-moment-group__label"><span>Food</span><p>I enjoy eating well, and I also enjoy cooking carefully</p></div>
      <div class="home-photo-strip">
        <img loading="lazy" decoding="async" src="/images/optimized/thumbs/personal-life/cooking-cn.webp" alt="Chinese food photo">
        <img loading="lazy" decoding="async" src="/images/optimized/thumbs/personal-life/baking.webp" alt="Baking photo">
        <img loading="lazy" decoding="async" src="/images/optimized/thumbs/Toast-500x300.webp" alt="Toast photo">
      </div>
    </div>

    <div class="home-moment-group home-moment-group--travel">
      <div class="home-moment-group__label"><span>Travel</span><p>Going out for a different view also refreshes ordinary days</p></div>
      <div class="home-photo-strip">
        <img loading="lazy" fetchpriority="low" decoding="async" src="/images/optimized/thumbs/home-page-2.webp" alt="Travel photo one">
        <img loading="lazy" fetchpriority="low" decoding="async" src="/images/optimized/thumbs/home-page-4.webp" alt="Travel photo two">
        <img loading="lazy" fetchpriority="low" decoding="async" src="/images/optimized/thumbs/home-page-5.webp" alt="Travel photo three">
      </div>
    </div>
  </section>

  <section class="home-quote">
    <blockquote><p>“Life is like riding a bicycle. To keep your balance, you must keep moving”</p><cite>Albert Einstein</cite></blockquote>
  </section>

  <section class="home-guestbook" aria-labelledby="home-guestbook-title">
    <div class="home-guestbook__intro">
      <div class="home-guestbook__icon" aria-hidden="true">•••</div>
      <h2 id="home-guestbook-title">Guestbook</h2>
      <p>If you pass by, feel free to leave a greeting, a suggestion, or a small good thing from your day.</p>
      <div class="home-guestbook__decoration" aria-hidden="true"></div>
    </div>
    <div class="home-guestbook__latest">
      <div class="home-guestbook__eyebrow">Recent messages</div>
      <div class="home-guestbook__messages" id="home-guestbook-preview" aria-live="polite"><p class="home-guestbook__empty">Loading recent messages...</p></div>
    </div>
    <a class="home-guestbook__button" href="/en/guestbook/">Visit guestbook</a>
  </section>
</section>
