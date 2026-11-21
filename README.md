# DiversityTemplate

DiversityTemplate 是一个基于 Hexo 8.1.2 和 Diversity 2.5.8 的多主题博客模板。同一份 Markdown 文章可以发布到 Reimu、Butterfly 和 Landscape，也可以按篇指定发布主题。Diversity 提供主题选择入口，构建后整站可部署到 GitHub Pages 的项目子路径。 [主题选择页](https://cmwlvip.github.io/DiversityTemplate/diversity/theme/)

## 已接入的主题

| 主题 | 用途和版本 | 构建输出 | 默认本地端口 |
| --- | --- | --- | --- |
| [Diversity](https://github.com/huazie/hexo-theme-diversity) | 2.5.8，站点入口和主题切换 | `public/` | `4000` |
| [Reimu](https://github.com/D-Sketon/hexo-theme-reimu) | 1.12.6 系列，固定在子模块提交 `2a2c5b2` | `public/reimu/` | `4001` |
| [Butterfly](https://github.com/jerryc127/hexo-theme-butterfly) | 5.7.2，博客子主题 | `public/butterfly/` | `4002` |
| [Landscape](https://github.com/hexojs/hexo-theme-landscape) | 1.1.0，博客子主题 | `public/landscape/` | `4003` |

仓库直接维护修改后的 `themes/diversity/` 源码，三个子主题以 Git 子模块固定版本。启用顺序由 [`_config.diversity.yml`](_config.diversity.yml) 的 `themes` 决定，子主题的站点配置位于 `config/<主题名>/_config.yml`。

## 本地启动

本地和 GitHub Actions 使用 Node.js `24.22.0`，版本也已写入 [`mise.toml`](mise.toml)。

```bash
git clone --recurse-submodules https://github.com/cmwlvip/DiversityTemplate.git
cd DiversityTemplate
npm ci
npm run server
```

首次克隆时若漏了子模块，在仓库根目录执行 `git submodule update --init --recursive`。服务启动后，打开 [本地主题选择页](http://localhost:4000/DiversityTemplate/diversity/theme/) 即可切换或直达子主题。

## 主题修改与新增脚本

- **适配 GitHub Pages 子路径。** Diversity 的导航、轮播封面和占位图随 Hexo 的站点前缀生成链接，Logo 和箭头使用相对于样式表的路径。博客页的 iframe 和「主题直达」同样带上站点前缀。各子主题的 `url` 和 `root` 由主站地址派生。迁移站点时，在根目录 [`_config.yml`](_config.yml) 中更新 `url` 即可让这些链接使用新的站点地址。 [Diversity 启动脚本](themes/diversity/scripts/index.js) · [菜单配置](source/_data/diversity_menu.yml)
- **各主题独立输出。** 每个子主题都配置了自己的 `public_dir`，避免静态构建时覆盖 Diversity 首页或其他主题的资源。 [子主题配置](config/)
- **修复文章图片地址。** `post-image-path.js` 在 Markdown 渲染前移除图片链接中的文章同名目录前缀，随后由 Marked 的 `postAsset` 解析为带主题前缀和日期目录的资源 URL。本地 Markdown 可以继续使用 `![说明](文章名/图片.png)`，图片放在 `source/_posts/文章名/`。 [图片路径脚本](scripts/post-image-path.js)
- **按篇指定发布主题。** `publish-theme.js` 在正文渲染前筛选文章，让各子主题的详情页、首页、归档、分类和标签使用同一批文章。使用主题专属标签的正文只交给选中的主题处理。 [主题发布脚本](scripts/publish-theme.js)

## 写作与发布

文章统一放在 `source/_posts/`。在文章的 Front Matter 中加入 `publish_theme`，即可指定发布范围。例如，使用 Butterfly 专属的 `{% note %}` 标签时，可这样配置：

```yaml
---
title: 我的 Hexo 笔记
publish_theme: butterfly
---
```

| 写法 | 发布范围 |
| --- | --- |
| 省略 `publish_theme` | 所有已启用的子主题 |
| `publish_theme: butterfly` | 仅 Butterfly |
| `publish_theme: [reimu, landscape]` | Reimu 和 Landscape，正文需兼容两个主题 |

主题名使用 `_config.diversity.yml` 中启用的标识。空列表或无效主题名会让构建报错，并指出对应文章。修改发布范围后执行 `npm run build`，即可重新生成站点并清理取消发布的旧文章页。

`npm run build` 会生成完整的 `public/`。推送到 `main` 或手动运行 GitHub Actions 工作流时，CI 会拉取子模块、安装依赖并构建，再将 `public/` 发布到 `gh-pages`。迁移到新仓库时，在 GitHub Pages 设置中选择 `gh-pages` 分支的 `/(root)` 作为发布源。 [部署工作流](.github/workflows/deploy.yml)
