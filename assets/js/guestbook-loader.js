// The third-party client has its own UI; bound both its import and API requests.
const status = document.getElementById('guestbook-status');
const english = document.documentElement.lang === 'en';
const serverURL = 'https://comments.liweining.cn';
const email = status.dataset.email;
const unavailable = english
  ? 'The guestbook is temporarily unavailable. Please refresh later or email ' + email + '.'
  : '留言板暂时无法读取，请稍后刷新，或发邮件至 ' + email + '。';
let serviceTimer;
function showFailure() { status.textContent = unavailable; status.hidden = false; }
function showReady() { clearTimeout(serviceTimer); status.hidden = true; }
const originalFetch = window.fetch.bind(window);
window.fetch = function (input, options) {
  const url = new URL(typeof input === 'string' ? input : (input.url || String(input)), location.href);
  if (url.origin !== serverURL) return originalFetch(input, options);
  const method = String(options?.method || input.method || 'GET').toUpperCase();
  const commentRead = method === 'GET' && /^\/(api\/)?comment\/?$/.test(url.pathname);
  const controller = new AbortController();
  const callerSignal = options?.signal || input.signal;
  const abort = () => controller.abort();
  if (callerSignal?.aborted) controller.abort();
  callerSignal?.addEventListener('abort', abort, {once:true});
  let timer;
  return Promise.race([
    originalFetch(input, {...options, signal:controller.signal}),
    new Promise((_, reject) => { timer = setTimeout(() => { controller.abort(); reject(new Error('Guestbook request timed out')); }, 8000); })
  ]).then(response => {
    if (commentRead) {
      if (response.ok) showReady();
      else showFailure();
    }
    return response;
  }).catch(error => {
    if (commentRead && !callerSignal?.aborted) showFailure();
    throw error;
  }).finally(() => {
    clearTimeout(timer);
    callerSignal?.removeEventListener('abort', abort);
  });
};
let importTimer;
try {
  const module = await Promise.race([
    import('https://unpkg.com/@waline/client@3.16.1/dist/waline.js'),
    new Promise((_, reject) => { importTimer = setTimeout(() => reject(new Error('Guestbook import timed out')), 8000); })
  ]);
  clearTimeout(importTimer);
  // Keep the status visible until the actual comments request succeeds.
  serviceTimer = setTimeout(showFailure, 8000);
  module.init({el:'#waline',serverURL,lang:english?'en':'zh-CN',path:'/guestbook/'});
} catch (error) {
  clearTimeout(importTimer);
  clearTimeout(serviceTimer);
  showFailure();
}
