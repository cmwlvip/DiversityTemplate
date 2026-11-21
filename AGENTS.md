# AGENTS

## 项目约定

- 一个基于 Hexo 8.1.2 和 Diversity 2.5.8 的多主题博客，主题`Diversity`有所更改。
- 通过`mise.toml` 确定node版本
- `codex`文件夹是ChatGPT的工作目录，没有特别要求不能修改主题代码。
- 文章默认使用简体中文，新文默认存入 `source/_drafts/`。仅在用户明确要求正式文章或发布草稿时写入 `source/_posts/`。编辑正式文章时更新 `updated`，保留原 `date`、文件名、永久链接和分类，除非任务明确要求调整。
- 公共图片存入 `source/img/`，通过 `/img/文件名` 引用。文章专用资源存入与 Markdown 文件同名的目录，路径大小写与文件一致。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm ci` | 按锁文件安装依赖，本地与 CI 使用同一命令 |
| `npm run server` | 预览正式页面 |
| `npm run server -- --draft` | 预览含草稿的页面 |
| `npm run build` | 生成 `public/` |
| `npm run clean` | 清除 Hexo 缓存和生成目录 |

`.github/workflows/deploy.yml` 在推送到 `main` 或手动触发时运行，构建后将 `public/` 发布到 `gh-pages`。推送、手动触发部署（含执行 `npm run deploy`）或更改部署目标，需用户明确授权。

## 按任务加载 Skill

- 新写、润色或审阅技术博客时，使用 [hexo-blog-writing](.agents/skills/hexo-blog-writing/SKILL.md)。
- 开发主题或独立页、排查资源和构建、执行 Hexo 草稿转正或检查 Pages 部署时，使用 [hexo-blog-maintenance](.agents/skills/hexo-blog-maintenance/SKILL.md)。
