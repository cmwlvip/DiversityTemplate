
const path = require('path');

hexo.extend.filter.register('before_post_render', function (data) {
  const source = (data.source || '').replace(/\\/g, '/');

  if (!source || !data.content) return data;

  // 获取 Markdown 文件名（不包含扩展名）
  const filename = path.posix.basename(
    source,
    path.posix.extname(source)
  );

  // 转义正则特殊字符
  const escaped = filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // 仅去除 Markdown 图片中的同名文件夹前缀
  const regex = new RegExp(
    `(!\\[[^\\]\\n]*\\]\\(\\s*<?)(?:\\./)?${escaped}/`,
    'g'
  );

  data.content = data.content.replace(regex, '$1');

  return data;
});
