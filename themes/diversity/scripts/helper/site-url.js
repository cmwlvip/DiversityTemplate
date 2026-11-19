'use strict';

const { url_for } = require('hexo-util');

module.exports = function siteUrl(path = '/') {
    const { root } = this.config;
    const pathname = path.split(/[?#]/, 1)[0];
    // Older project-site configurations may already include the Hexo root.
    if (root !== '/' && (pathname === root.slice(0, -1) || pathname.startsWith(root))) {
        return path;
    }
    return url_for.call(this, path, { relative: false });
};
