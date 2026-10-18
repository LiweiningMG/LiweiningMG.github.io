// Run with Node + Playwright available (NODE_PATH may point to the bundled runtime).
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
let browser;
before(async () => { browser = await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL || 'msedge'}); });
after(async () => { await browser?.close(); });
test('wide-screen layouts use the viewport with aligned modest gutters', async () => {
  const page=await browser.newPage();
  try {
    for(const width of [1920,2560]) {
      await page.setViewportSize({width,height:1000});
      for(const route of ['/','/cv/','/publications/','/personal-life/','/en/cv/']) {
        await page.goto('http://127.0.0.1:4000'+route,{waitUntil:'domcontentloaded'});
        const edges=await page.evaluate(()=>{
          const main=document.getElementById('main');
          const content=main.querySelector(':scope > .sidebar') || main.querySelector('.home-landing,.life-page') || main.firstElementChild;
          const right=(main.querySelector(':scope > .archive,:scope > .page') || main).getBoundingClientRect().right;
          return {left:content.getBoundingClientRect().left,right:document.documentElement.clientWidth-right,brand:document.querySelector('.site-nav__brand').getBoundingClientRect().left};
        });
        assert.ok(edges.left>=20 && edges.left<=48,`${route} has excessive left gutter: ${edges.left}px`);
        assert.ok(edges.right>=20 && edges.right<=48,`${route} has excessive right gutter: ${edges.right}px`);
        assert.ok(Math.abs(edges.brand-edges.left)<2,`${route} brand and main content align`);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      }
    }
  } finally { await page.close(); }
});
test('Chinese sidebar affiliation names remain intact on desktop and in mobile contacts', async () => {
  const page = await browser.newPage();
  try {
    for (const width of [1440,1280,1024,390,320]) {
      await page.setViewportSize({width,height:900});
      await page.goto('http://127.0.0.1:4000/cv/',{waitUntil:'domcontentloaded'});
      if(width<1024) await page.locator('.author__urls-wrapper button').click();
      for (const name of ['江苏省农业科学院畜牧研究所','福建永诚育种科技集团有限公司']) {
        const lines=await page.locator('.author__urls').evaluate((list,name)=>{
          const nodes=document.createTreeWalker(list,NodeFilter.SHOW_TEXT);
          for(let node;node=nodes.nextNode();) {
            const start=node.textContent.indexOf(name);if(start<0)continue;
            const range=document.createRange();range.setStart(node,start);range.setEnd(node,start+name.length);
            return new Set(Array.from(range.getClientRects()).map(r=>Math.round(r.top))).size;
          }
          return 0;
        },name);
        assert.equal(lines,1,`${name} wraps at ${width}px`);
      }
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      if(width>=1024) assert.ok((await page.locator('#main > .archive').boundingBox()).width>600,'main column remains readable');
    }
  } finally { await page.close(); }
});
test('mobile contact panel stays on screen in both languages', async () => {
  const page=await browser.newPage();
  try {
    for(const width of [320,390]) {
      await page.setViewportSize({width,height:900});
      for(const route of ['/cv/','/en/cv/']) {
        await page.goto('http://127.0.0.1:4000'+route,{waitUntil:'domcontentloaded'});
        await page.locator('.author__urls-wrapper button').click();
        const panel=await page.locator('.author__urls').boundingBox();
        assert.ok(panel.x>=0 && panel.x+panel.width<=width,`panel is off screen at ${route} ${width}`);
      }
    }
  } finally { await page.close(); }
});
test('project periods are readable on one line in the desktop project table', async () => {
  const page = await browser.newPage();
  try {
    for (const width of [1440,1024]) {
      await page.setViewportSize({width,height:900});
      for (const route of ['/cv/','/en/cv/']) {
        await page.goto('http://127.0.0.1:4000'+route,{waitUntil:'domcontentloaded'});
        const lines = await page.locator('.cv-project-table tbody tr td:first-child').evaluateAll(cells=>cells.map(cell=>{
          const range=document.createRange();range.selectNodeContents(cell);
          return new Set(Array.from(range.getClientRects()).map(r=>Math.round(r.top))).size;
        }));
        assert.deepEqual(lines,[1,1,1,1,1], `wrapped project periods at ${route} ${width}`);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      }
    }
  } finally { await page.close(); }
});
test('CV section navigation stays reachable and reveals unobscured headings after scrolling', async () => {
  const page = await browser.newPage();
  try {
    for (const width of [1440,1024,768,390,320]) {
      await page.setViewportSize({width,height:900});
      for (const route of ['/cv/','/en/cv/']) {
        await page.goto('http://127.0.0.1:4000'+route,{waitUntil:'domcontentloaded'});
        await page.evaluate(()=>scrollTo(0,1400));
        const bar = await page.locator('.cv-section-nav').boundingBox();
        const masthead = await page.locator('.masthead').boundingBox();
        assert.ok(bar.y >= masthead.y + masthead.height - 1 && bar.y < masthead.height + 25, `navigation top ${bar.y} at ${route} ${width}`);
        const link = page.locator('.cv-section-nav a').nth(1);
        const fragment = await link.getAttribute('href');
        await link.click();
        const target = await page.evaluate(hash=>document.getElementById(decodeURIComponent(hash.slice(1))).getBoundingClientRect().top,fragment);
        const pinned = await page.locator('.cv-section-nav').boundingBox();
        assert.ok(target >= pinned.y + pinned.height - 1, `heading hidden under navigation at ${width}`);
        assert.ok(target < pinned.y + pinned.height + 40, 'heading is positioned just below the sticky navigation');
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
        // The last section must remain reachable on the single-row mobile strip, including keyboard focus.
        await page.locator('.cv-section-nav a').last().focus();
        await page.keyboard.press('Enter');
        const lastHeading = await page.locator('.cv-page h2').last().boundingBox();
        assert.ok(lastHeading.y >= pinned.y + pinned.height - 1);
      }
    }
  } finally { await page.close(); }
});
test('work dates remain on one line without squeezing the role content', async () => {
  const page = await browser.newPage();
  try {
    for (const width of [1440,1024,390,320]) {
      await page.setViewportSize({width,height:900});
      for (const route of ['/cv/','/en/cv/']) {
        await page.goto('http://127.0.0.1:4000'+route,{waitUntil:'domcontentloaded'});
        const dateLines = await page.locator('.role-timeline__date').evaluateAll(dates=>dates.map(el=>{
          const range=document.createRange();range.selectNodeContents(el);
          return new Set(Array.from(range.getClientRects()).map(r=>Math.round(r.top))).size;
        }));
        assert.deepEqual(dateLines,[1,1,1], `wrapped dates at ${route} ${width}`);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      }
    }
  } finally { await page.close(); }
});
test('desktop sidebar stays visible as long-page content scrolls', async () => {
  const page = await browser.newPage();
  try {
    for (const viewport of [{width:1440,height:900},{width:1024,height:768},{width:1280,height:600}]) {
      await page.setViewportSize(viewport);
      await page.goto('http://127.0.0.1:4000/cv/', {waitUntil:'domcontentloaded'});
      const initial = await page.locator('#main > .sidebar').boundingBox();
      await page.evaluate(()=>window.scrollTo(0,1400));
      const scrolled = await page.locator('#main > .sidebar').boundingBox();
      assert.ok(await page.evaluate(()=>window.scrollY) >= 1400);
      assert.ok(scrolled.y >= 80 && scrolled.y <= initial.y, `sidebar top ${scrolled.y} at ${viewport.width}px`);
      assert.ok(scrolled.y + scrolled.height <= viewport.height, 'sidebar fits the available viewport');
      // On short displays every contact link remains reachable by scrolling the sidebar itself.
      await page.locator('.sidebar a').last().scrollIntoViewIfNeeded();
      const lastLink = await page.locator('.sidebar a').last().boundingBox();
      assert.ok(lastLink.y >= 80 && lastLink.y + lastLink.height <= viewport.height);
    }
  } finally { await page.close(); }
});
async function fixture(lang = 'en', remote = 'ok') {
  const page = await browser.newPage();
  await page.route('https://comments.liweining.cn/**', async route => {
    if (remote === 'hang') return;
    if (remote === 'fail') return route.fulfill({status:503,body:'Unavailable'});
    const visits = route.request().url().includes('site-visits');
    await route.fulfill({contentType:'application/json',body:JSON.stringify(visits?{todayVisitors:7,totalVisitors:123}:{data:[{nick:'Visitor',comment:'<p>Hello <strong>world</strong></p>',insertedAt:'2026-10-01T12:00:00Z',like:1}]})});
  });
  await page.setContent(`<html lang="${lang}"><body><button id="before">Before</button><button id="gallery" data-gallery-title="Badminton" data-gallery-images="/one.webp|/two.webp">Photos</button><a id="after" href="#">After</a><div id="home-guestbook-preview"></div><div class="site-visit-stats" data-site-visit-endpoint="https://comments.liweining.cn/api/site-visits"><strong data-site-visit-today>Loading</strong><strong data-site-visit-total>Loading</strong></div></body></html>`);
  await page.addScriptTag({content:fs.readFileSync(path.join(__dirname,'../assets/js/site-enhancements.js'),'utf8')});
  return page;
}
test('gallery contains keyboard focus and restores the originating control', async () => {
  const page = await fixture();
  try {
    await page.locator('#gallery').click();
    assert.equal(await page.evaluate(()=>!!document.activeElement.closest('[role="dialog"]')),true);
    assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
    await page.keyboard.press('Shift+Tab');
    assert.equal(await page.evaluate(()=>!!document.activeElement.closest('[role="dialog"]')),true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('[role="dialog"]').count(),0);
    assert.equal(await page.evaluate(()=>document.activeElement.id),'gallery');
    assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
  } finally { await page.close(); }
});
test('English gallery exposes English controls and single-image navigation', async () => {
  const page = await fixture();
  try {
    await page.locator('#gallery').click();
    assert.equal(await page.getByRole('button',{name:'Close',exact:true}).count(),1);
    await page.locator('[data-photo-index="0"]').click();
    assert.match(await page.locator('[data-photo-counter]').innerText(),/1\s*\/\s*2/);
    await page.getByRole('button',{name:'Next image'}).click();
    assert.match(await page.locator('[data-photo-counter]').innerText(),/2\s*\/\s*2/);
    await page.getByRole('button',{name:'Zoom image'}).click();
    assert.equal(await page.getByRole('button',{name:'Zoom image'}).getAttribute('aria-pressed'),'true');
  } finally { await page.close(); }
});
test('successful comment and visitor responses render real supplied values', async () => {
  const page = await fixture();
  try {
    await page.waitForFunction(()=>document.querySelector('[data-site-visit-total]').textContent==='123');
    assert.match(await page.locator('#home-guestbook-preview').innerText(),/Hello world/);
    assert.equal(await page.locator('[data-site-visit-today]').innerText(),'7');
  } finally { await page.close(); }
});
test('unavailable visitor service settles into a readable failure state', async () => {
  const page = await fixture('en','fail');
  try {
    await page.waitForTimeout(300);
    assert.match(await page.locator('.site-visit-stats').innerText(),/Unavailable/);
    assert.match(await page.locator('#home-guestbook-preview').innerText(),/temporarily unavailable/);
  } finally { await page.close(); }
});
test('a hanging remote service stops loading after the request deadline', {timeout:15000}, async () => {
  const page = await fixture('en','hang');
  try {
    await page.waitForTimeout(9000);
    assert.match(await page.locator('#home-guestbook-preview').innerText(),/temporarily unavailable/);
    assert.match(await page.locator('.site-visit-stats').innerText(),/Unavailable/);
  } finally { await page.close(); }
});
test('the full guestbook shows a failure message when its comments API hangs', {timeout:30000}, async () => {
  const page = await browser.newPage();
  await page.route('https://comments.liweining.cn/**', () => {});
  try {
    await page.goto('http://127.0.0.1:4000/en/guestbook/', {waitUntil:'domcontentloaded'});
    await page.locator('.wl-editor').waitFor({timeout:15000});
    await page.waitForTimeout(9500);
    assert.equal(await page.locator('#guestbook-status').isVisible(),true);
    assert.match(await page.locator('#guestbook-status').innerText(),/temporarily unavailable/);
  } finally { await page.close(); }
});
test('English conference metadata keeps an English title', async () => {
  const page = await browser.newPage();
  try {
    await page.goto('http://127.0.0.1:4000/en/publication/2023-08-19-conference-1/');
    assert.match(await page.title(),/^Bayesian models for multibreed/);
    assert.match(await page.locator('meta[property="og:title"]').getAttribute('content'),/^Bayesian models for multibreed/);
  } finally { await page.close(); }
});
test('mobile tutorial keeps working navigation when JavaScript is disabled', async () => {
  const context = await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  const page = await context.newPage();
  try {
    await page.goto('http://127.0.0.1:4000/teaching/animal-breeding-genomic-selection/');
    assert.equal(await page.locator('#site-menu').isVisible(),true);
    assert.equal(await page.locator('[data-menu-toggle]').isVisible(),false);
  } finally { await context.close(); }
});
test('mobile tutorial menu opens below its enlarged masthead', async () => {
  const page = await browser.newPage({viewport:{width:390,height:844}});
  try {
    await page.goto('http://127.0.0.1:4000/teaching/animal-breeding-genomic-selection/');
    await page.locator('[data-menu-toggle]').click();
    const header = await page.locator('.masthead').boundingBox();
    const menu = await page.locator('#site-menu').boundingBox();
    assert.ok(menu.y >= header.y + header.height, 'menu overlaps the enlarged masthead');
  } finally { await page.close(); }
});
