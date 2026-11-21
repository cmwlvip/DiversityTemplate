---
name: hexo-blog-maintenance
description: 维护本仓库的 Hexo 多主题站点，适用于修改 Diversity 主题或独立页、排查资源路径和构建问题、草稿转正以及检查 GitHub Pages 部署。
---

# Hexo 站点维护

遵循根目录 [AGENTS.md](../../../AGENTS.md) 中的主题修改和部署授权约定。按任务读取相关配置和源码。

## 主题与独立页

- 根目录 `_config.yml` 管理主站地址、永久链接和默认主题。子主题启用顺序由 `_config.diversity.yml` 的 `themes` 决定，站点配置在 `config/<主题名>/_config.yml`。
- Diversity 独立页入口位于 `source/diversity/<页面>/index.md`。改页面时从入口的 `layout` 找对应布局，按需检查 `source/_data/` 中的菜单或其他页面数据。
- `themes/diversity/` 由本仓库维护，其余三套主题通过 Git 子模块固定版本。构建提示找不到子主题时，先用 `git submodule status` 检查。子模块尚未初始化时，运行 `git submodule update --init --recursive`。调整子主题站点行为时优先检查现有配置入口。

## 构建与资源排查

- 按 `mise.toml` 选择 Node 版本，缺少依赖时运行 `npm ci`。使用 `AGENTS.md` 中的命令预览或生成，并查看首个构建错误。怀疑旧生成物或 Hexo 缓存干扰时，再清理并重建。
- 构建产物在 `public/`，各子主题输出到 `public/<主题名>/`。确认问题出在哪个主题及其路由。检查生成的 HTML 与对应文件，确保链接能在 `_config.yml` 的站点子路径和相应主题前缀下解析。
- 文章图片先核对同名资源目录，再检查 `scripts/post-image-path.js` 对 Markdown 相对引用的处理，以及对应主题配置的 `post_asset_folder`、`marked.prependRoot` 和 `marked.postAsset`。公共图片按 `AGENTS.md` 的约定引用，排查时以生成的 URL 为准。
- 文章缺失或遇到主题专属标签渲染错误时，核对启用主题与文章的 `publish_theme`，并检查 `scripts/publish-theme.js`。变更发布范围后，按受影响的主题检查文章页和索引页。

## 草稿转正

1. 用户明确要求转正时，定位 `source/_drafts/` 下的目标 Markdown 和同名资源目录，检查 `source/_posts/` 下对应目标是否已存在。目标有冲突时先处理冲突，避免覆盖正文或混合资源。
2. 将 Markdown 与同名资源目录一并移入 `source/_posts/`，保留文件名和正文内的资源链接。按 [Front Matter 规范](../../docs/front-matter.yml) 核对元数据。有明确的 `date` 时保留，缺少时填写成文日期或用户指定的发布时间，并填写 `updated`。
3. 运行 `npm run build`，检查文章在预期主题生成、永久链接符合日期及路径设置，图片可从生成目录访问。

## GitHub Pages 部署检查

以 [部署工作流](../../../.github/workflows/deploy.yml) 为准核对触发分支、Node 版本、依赖安装、构建输出与发布分支。排查线上问题时查看对应提交的 Actions 日志，区分构建失败、发布失败和页面路径错误。推送、触发部署或更改发布设置前，遵循 `AGENTS.md` 的授权约定。
