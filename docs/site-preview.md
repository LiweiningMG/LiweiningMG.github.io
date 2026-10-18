# 本地预览与日常维护

本地预览按 2026-10-13 确认的清单实施。旅行详情板块暂缓，现有首页照片保留。

## 内容入口

- `_data/profile.yml`：姓名、邮箱、当前及过去任职、任期的中英文信息。
- `_data/publications.yml`：所有简历引用、主要成果卡片、论文说明、DOI、PDF 与详情地址。
- `_data/projects.yml`：科研项目的中英文信息；未展示的项目名称填 `***`，未提供的经费留空。
- `_data/academic-service.yml`：期刊审稿和编委任职，中英文简历共用。
- `_pages`、`_publications`、`_teaching`：页面正文和路由。论文详情通过 `publication_id` 引用共享记录。
- `_sass/_site-preview.scss`：统一页面样式。
- `images/icons/site-icon.svg`、`images/site-share-cover.svg`：可编辑的图标和分享封面源文件。

## 构建

安装已有 Gemfile 依赖后，在仓库根目录运行：

```sh
bundle exec jekyll build --config _config.yml,_config_local.yml
node scripts/serve-preview.cjs
```

打开 `http://127.0.0.1:4000/`。预览访问不会计入公开网站访问统计。预览中的留言会读取真实公开留言；审查时不要提交测试留言。

当前设备也可以在 WSL 使用 `BUNDLE_PATH=/var/tmp/codex-site-preview-gems bundle exec jekyll build --config _config.yml,_config_local.yml`。首次使用或缓存失效时，先以相同 `BUNDLE_PATH` 运行 `bundle install`；避免将依赖仅保存在容易被清理的 `/tmp`。

生产构建只使用 `_config.yml`，其中主域名为 `https://liweining.cn`。`CNAME` 和已有 DNS 保持不变。生产配置测试可以指定 `--destination tmp/site-production`，无需发布。

## 检查

```sh
node --test scripts/check-site-links.test.mjs
node scripts/check-site-links.mjs _site
node --test scripts/site-interactions.test.cjs
node scripts/verify-preview.cjs tmp/preview-evidence
```

浏览器测试需要可用的 Playwright 和浏览器，并先启动预览服务。默认使用 Edge，可通过 `PLAYWRIGHT_CHANNEL` 调整；共享运行时可通过 `NODE_PATH` 指向其 Node 包目录。

链接检查覆盖生成 HTML、CSS、manifest 和图集中的站内引用，不会把外部站点的临时网络故障当作本站死链。

模板示例保留源码并设置 `published: false`。它们不会出现在公开页面、sitemap 或 RSS 中。
