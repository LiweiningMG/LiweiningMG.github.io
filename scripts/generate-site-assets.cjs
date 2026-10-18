// Requires sharp. The SVG files remain the editable source of these native assets.
const sharp = require('sharp');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const icons = path.join(root, 'images/icons');
(async () => {
  const svg = fs.readFileSync(path.join(icons, 'site-icon.svg'));
  const sizes = {'favicon-16.png':16,'favicon-32.png':32,'apple-touch-icon.png':180,'icon-192.png':192,'icon-512.png':512};
  for (const [name,size] of Object.entries(sizes)) await sharp(svg).resize(size,size).png().toFile(path.join(icons,name));
  const maskable = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><rect width="512" height="512" fill="#146b5b"/><g transform="translate(96 96) scale(.625)">'+svg.toString().replace(/<svg[^>]*>|<\/svg>/g,'')+'</g></svg>');
  await sharp(maskable).png().toFile(path.join(icons,'icon-maskable-512.png'));
  await sharp(path.join(root,'images/site-share-cover.svg')).png().toFile(path.join(root,'images/site-share-cover.png'));
  console.log('Generated 6 icons and a 1200×630 share cover.');
})().catch(error => { console.error(error); process.exit(1); });
