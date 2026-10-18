const {chromium}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const origin=process.env.SITE_PREVIEW_URL||'http://127.0.0.1:4000';
const out=process.argv[2]||path.resolve(__dirname,'../tmp/preview-evidence');
fs.mkdirSync(out,{recursive:true});
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||'msedge'});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();
 const report={pages:[],interactions:[],errors:[]};
 page.on('pageerror',error=>report.errors.push({url:page.url(),message:error.message}));
 const routes=['/','/cv/','/publications/','/talks/','/teaching/','/personal-life/','/guestbook/','/en/','/en/cv/','/en/publications/','/en/talks/','/en/teaching/','/en/personal-life/','/en/guestbook/','/privacy/','/en/privacy/','/publication/2022-07-26-Animals','/publication/2025-12-20-JASB','/teaching/animal-breeding-genomic-selection/'];
 for(const route of routes){
  const response=await page.goto(origin+route,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200,route);
  const data=await page.evaluate(()=>({title:document.title,h1:[...document.querySelectorAll('h1')].map(x=>x.textContent.trim()).filter(Boolean),description:document.querySelector('meta[name=description]')?.content,cover:document.querySelector('meta[property="og:image"]')?.content,canonical:document.querySelector('link[rel=canonical]')?.href,overflow:document.documentElement.scrollWidth>innerWidth}));
  assert.ok(data.description,route+' description');assert.ok(data.cover,route+' cover');assert.equal(data.h1.length,1,route+' single heading');assert.equal(data.overflow,false,route+' overflow');
  report.pages.push({route,...data});
  if(['/','/cv/','/personal-life/','/publications/','/teaching/'].includes(route)){
   for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=800){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(100)}
   await page.waitForTimeout(400);await page.evaluate(()=>scrollTo(0,0));
   const slug=route==='/'?'home':route.replaceAll('/','');await page.screenshot({path:path.join(out,slug+'-desktop.png'),fullPage:true});
   if(route==='/')await page.screenshot({path:path.join(out,'home-first-screen.png')});
  }
 }
 await page.goto(origin+'/publication/2024-07-26-Animal');await page.waitForURL('**/publication/2022-07-26-Animals');report.interactions.push('Former paper URL redirects to the corrected paper.');
 await page.goto(origin+'/cv/');const cv=await page.locator('.cv-page').innerText();assert.match(cv,/2026\.09 至今/);assert.match(cv,/2024\.08 至今/);assert.match(cv,/2025\.11 – 2026\.08/);assert.match(cv,/福建永诚育种科技集团有限公司/);assert.equal(await page.locator('.cv-section-nav a').count()>5,true);report.interactions.push('Consultancy dates and CV section navigation verified.');
 await page.goto(origin+'/en/personal-life/');const card=page.locator('[data-gallery-title="Badminton"]');await card.click();assert.equal(await page.getByRole('button',{name:'Close',exact:true}).count(),1);assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');await page.locator('[data-photo-index="0"]').click();await page.getByRole('button',{name:'Next image'}).click();assert.match(await page.locator('[data-photo-counter]').innerText(),/2\s*\/\s*4/);await page.screenshot({path:path.join(out,'gallery-desktop.png')});await page.keyboard.press('Escape');assert.equal(await page.locator('[role=dialog]').count(),0);assert.equal(await card.evaluate(x=>x===document.activeElement),true);report.interactions.push('English gallery navigation, Escape and focus return verified.');
 await page.goto(origin+'/publication/2022-07-26-Animals');await page.locator('.masthead__menu-item--language a').click();assert.equal(new URL(page.url()).pathname,'/en/publication/2022-07-26-Animals/');await page.locator('.masthead__menu-item--language a').click();assert.equal(new URL(page.url()).pathname,'/publication/2022-07-26-Animals');report.interactions.push('Paper language switching works in both directions.');
 for(const width of [320,390,768]){
  await page.setViewportSize({width,height:844});
  for(const route of ['/','/cv/','/personal-life/','/publications/','/teaching/animal-breeding-genomic-selection/']){
   await page.goto(origin+route,{waitUntil:'domcontentloaded'});await page.waitForTimeout(250);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route+' mobile '+width);
   if(width===390){const slug=route==='/'?'home':route.split('/').filter(Boolean).at(-1);await page.screenshot({path:path.join(out,slug+'-mobile.png'),fullPage:!route.includes('genomic-selection')});if(route==='/'||route==='/cv/')await page.screenshot({path:path.join(out,slug+'-mobile-first.png')});}
  }
 }
 await page.goto(origin+'/');const menu=page.locator('[data-menu-toggle]');await menu.click();assert.equal(await menu.getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await menu.getAttribute('aria-expanded'),'false');await menu.click();await page.mouse.click(2,500);assert.equal(await menu.getAttribute('aria-expanded'),'false');report.interactions.push('Mobile menu state, Escape and outside click verified.');
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const staticPage=await nojs.newPage();await staticPage.goto(origin+'/');await staticPage.evaluate(()=>scrollTo(0,document.body.scrollHeight));await staticPage.waitForTimeout(300);assert.equal(await staticPage.locator('img[data-lazy-src]').count(),0);assert.equal(await staticPage.locator('#site-menu').isVisible(),true);report.interactions.push('No-JavaScript homepage retains real image URLs and navigation.');
 for(const disabled of ['/markdown/','/page-archive/','/posts/2012/08/blog-post-4/'])assert.equal((await page.goto(origin+disabled)).status(),404,disabled);
 report.interactions.push('Template demo routes no longer publish.');
 assert.deepEqual(report.errors,[]);fs.writeFileSync(path.join(out,'verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({pages:report.pages.length,interactions:report.interactions,errors:report.errors}));await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
