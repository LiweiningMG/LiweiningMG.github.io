import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {checkSite} from './check-site-links.mjs';

test('reports a broken page, missing gallery asset, and invalid fragment',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'site-link-fixture-'));
  try {
    fs.writeFileSync(path.join(root,'index.html'),'<a href="/missing/">Missing</a><a href="/#absent">Fragment</a><button data-gallery-images="/missing.webp"></button>');
    const result=checkSite(root);
    assert.equal(result.failures.length,3);
    assert.equal(result.failures.filter(item=>item.reason==='Missing fragment').length,1);
  } finally {fs.rmSync(root,{recursive:true,force:true});}
});
test('accepts clean URLs, canonical-origin links, existing anchors and gallery assets',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'site-link-fixture-'));
  try {
    fs.mkdirSync(path.join(root,'cv'));
    fs.writeFileSync(path.join(root,'cv/index.html'),'<h1 id="education">CV</h1>');
    fs.writeFileSync(path.join(root,'photo.webp'),'asset');
    fs.writeFileSync(path.join(root,'index.html'),'<a href="https://liweining.cn/cv/#education">CV</a><button data-gallery-images="/photo.webp"></button>');
    assert.deepEqual(checkSite(root).failures,[]);
  } finally {fs.rmSync(root,{recursive:true,force:true});}
});
