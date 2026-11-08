# Locally served browser libraries

These pinned upstream distributions are served with the site so loading a page
does not require a separate request to unpkg, jsDelivr, or a QR image API.

| Library | Version | Upstream distribution | License |
| --- | --- | --- | --- |
| Waline client | 3.16.1 | https://registry.npmjs.org/@waline/client/-/client-3.16.1.tgz | MIT, included in package directory |
| Waline emoji preset | 1.1.0 | https://registry.npmjs.org/@waline/emojis/-/emojis-1.1.0.tgz | Upstream package and preset license notices included |
| MathJax | 3.2.2 | https://registry.npmjs.org/mathjax/-/mathjax-3.2.2.tgz | Apache-2.0, included in package directory |
| QR Code Generator | 1.4.4 | https://registry.npmjs.org/qrcode-generator/-/qrcode-generator-1.4.4.tgz | MIT, upstream notices retained in source |

Waline includes its bundled runtime. MathJax contains the combined TeX/MathML
CommonHTML component, input extensions, output components, and local webfonts.
QR images are generated in the browser and do not send page URLs to a QR API.

Comment data, authentication, and visitor statistics still use the configured
comment server. Hosting these libraries locally does not move that backend or
resolve connectivity to the website's hosting provider.
