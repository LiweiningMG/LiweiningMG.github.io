const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'../_site');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.xml':'application/xml; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.ico':'image/x-icon','.pdf':'application/pdf','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf'};
http.createServer((req,res)=>{
  try {
    const url=new URL(req.url,'http://127.0.0.1:4000');
    const base=path.resolve(root,'.'+decodeURIComponent(url.pathname));
    if(base!==root&&!base.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    const target=[base,path.join(base,'index.html'),base+'.html'].find(candidate=>fs.existsSync(candidate)&&fs.statSync(candidate).isFile());
    const file=target||path.join(root,'404.html');
    res.writeHead(target?200:404,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
    if(req.method==='HEAD')res.end();else fs.createReadStream(file).pipe(res);
  }catch(_){res.writeHead(400);res.end('Bad request');}
}).listen(4000,'127.0.0.1',()=>console.log('Preview: http://127.0.0.1:4000/ (local only, no deployment)'));
