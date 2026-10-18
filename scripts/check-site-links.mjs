import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const defaultOrigins = ['https://liweining.cn', 'https://liweiningmg.github.io', 'http://127.0.0.1:4000', 'http://localhost:4000'];
function filesIn(directory) {
  return fs.readdirSync(directory, {withFileTypes:true}).flatMap(entry => {
    const full = path.join(directory,entry.name);
    return entry.isDirectory() ? filesIn(full) : [full];
  });
}
function decodeEntities(value) {
  return value.replace(/&amp;/g,'&').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n))).replace(/&#x([a-f\d]+);/gi,(_,n)=>String.fromCodePoint(parseInt(n,16)));
}
export function checkSite(directory, origins = defaultOrigins) {
  const root=path.resolve(directory), failures=[], html=filesIn(root).filter(file=>file.endsWith('.html'));
  let checked=0;
  const ids=new Map();
  function targetFor(pathname) {
    const relative=decodeURIComponent(pathname).replace(/^\/+/,'');
    const full=path.resolve(root,relative);
    if(full!==root && !full.startsWith(root+path.sep)) return null;
    return [full,path.join(full,'index.html'),full+'.html'].find(candidate=>fs.existsSync(candidate)&&fs.statSync(candidate).isFile());
  }
  function inspect(value, from, source) {
    if (!value || /^(data:|mailto:|tel:|javascript:)/i.test(value)) return;
    let url;
    try { url=new URL(decodeEntities(value),'https://liweining.cn'+from); } catch { failures.push({source,value,reason:'Invalid URL'});return; }
    if(!origins.includes(url.origin)) return;
    checked++;
    const target=targetFor(url.pathname);
    if(!target){failures.push({source,value,reason:'Missing local page or asset'});return;}
    if(url.hash && target.endsWith('.html')) {
      if(!ids.has(target)) ids.set(target,new Set([...fs.readFileSync(target,'utf8').matchAll(/\bid\s*=\s*["']([^"']+)["']/g)].map(match=>decodeEntities(match[1]))));
      const fragment=decodeURIComponent(url.hash.slice(1));
      if(fragment&&!ids.get(target).has(fragment)) failures.push({source,value,reason:'Missing fragment'});
    }
  }
  for(const file of html){
    const source=path.relative(root,file).replaceAll(path.sep,'/');
    const from='/'+source.replace(/index\.html$/,'');
    const text=fs.readFileSync(file,'utf8');
    for(const match of text.matchAll(/\b(?:href|src)\s*=\s*["']([^"']*)["']/g)) inspect(match[1],from,source);
    for(const match of text.matchAll(/\bdata-gallery-images\s*=\s*["']([^"']*)["']/g)) match[1].split('|').forEach(value=>inspect(value,from,source));
  }
  for(const file of filesIn(root).filter(file=>file.endsWith('.css'))){
    const source=path.relative(root,file).replaceAll(path.sep,'/');
    for(const match of fs.readFileSync(file,'utf8').matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) inspect(match[1],'/'+source,source);
  }
  const manifest=path.join(root,'images/manifest.json');
  if(fs.existsSync(manifest)) for(const icon of JSON.parse(fs.readFileSync(manifest,'utf8')).icons||[]) inspect(icon.src,'/images/manifest.json','images/manifest.json');
  return {pages:html.length,checked,failures};
}
if(process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  const directory=process.argv[2]||'_site';
  if(!fs.existsSync(directory)){console.error('Build the site before checking links. Missing: '+directory);process.exitCode=1;}
  else {const result=checkSite(directory);console.log(JSON.stringify(result,null,2));process.exitCode=result.failures.length?1:0;}
}
