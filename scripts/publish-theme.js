'use strict';

const { join } = require('node:path');

// Run before Hexo's render_post filter (priority 10) and theme generators.
hexo.extend.filter.register('before_generate', async function () {
  const scopedPosts = this.model('Post').toArray().filter(post =>
    Object.hasOwn(post, 'publish_theme')
  );
  if (!scopedPosts.length) return;

  const { themes } = this.config.theme === 'diversity'
    ? this.config.theme_config
    : await this.render.render({ path: join(this.base_dir, '_config.diversity.yml') });

  const excludedPosts = scopedPosts.filter(post => {
    const value = post.publish_theme;
    const selectedThemes = Array.isArray(value) ? value : [value];
    if (!selectedThemes.length || !selectedThemes.every(theme => themes.includes(theme))) {
      throw new Error(`${post.source}: invalid publish_theme ${JSON.stringify(value)}. Enabled themes: ${themes.join(', ')}`);
    }

    return !selectedThemes.includes(this.config.theme);
  });

  // Removing a Post also removes its category, tag, and asset associations.
  await Promise.all(excludedPosts.map(post => post.remove()));
  this.locals.invalidate();
}, 1);
