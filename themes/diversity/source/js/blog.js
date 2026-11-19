(function(){
	// 展示默认的主题
	showDefaultBlogPage();
})();

// 监听 iframe 通过 postMessage 发来的路由变化 
window.addEventListener('message', function(event) {
    const blogIframe = document.getElementById('blog');
    if (!blogIframe) return;
    // 过滤：只处理 iframe 发来的路由变化消息
    if (event.source !== blogIframe.contentWindow) return;
    if (!event.data || event.data.type !== 'diversity:route-change') return;

    const theme = Diversity.data.get('theme');
    if (!config.themes.includes(theme)) return;
    const themeRoot = Diversity.browser.getThemeUrl(theme).pathname;
    const path = event.data.path;
    if (typeof path !== 'string' || !path.startsWith(themeRoot)) return;

    const url = new URL(window.location.href);
    const blogPath = path.slice(themeRoot.length);
    if (blogPath) {
        url.searchParams.set('path', '/' + blogPath);
    } else {
        url.searchParams.delete('path');
    }
    history.replaceState({ path: url.pathname }, '', url.href);
});

function showDefaultBlogPage() {
    // 设置的默认主题名
    const theme = Diversity.data.get('theme');
    const blogIframe = document.getElementById('blog');
	// 如果没有设置默认主题，则跳转无主题页
    if (!config.themes.includes(theme)) {
        blogIframe.src = config.no_theme.url;
        return;
    }

    // 添加loading效果
    blogIframe.classList.add('loading');

    const themeUrl = Diversity.browser.getThemeUrl(theme);
    const path = new URLSearchParams(window.location.search).get('path') || '';
    const url = themeUrl.href + path.replace(/^\/+/, '');

    blogIframe.addEventListener('load', function() {
        // 去除loading效果
        blogIframe.classList.remove('loading');
        try {
            // 注意：这块代码本地因为针对不同主题启动不同的http服务，主页面与iframe页面跨域了，无法正常运行
            // 获取iframe的窗口对象
            const iframeWindow = blogIframe.contentWindow || blogIframe.contentDocument.defaultView;
            if (!iframeWindow) {
                console.error('[blog.js] 无法获取 iframeWindow');
                return;
            }

            // 获取header标签
            const header = document.getElementById('header');
            // 获取header标签的类名列表
            const navHeaderClassList = header.classList;
            // 获取返回顶部按钮
            const backToTop = document.querySelector('.back-to-top');
            // 添加iframe窗口的滚动事件

            const scrollHandler = function() {
                let scrollHeight = iframeWindow.pageYOffset || iframeWindow.document.documentElement.scrollTop;
                // 菜单导航栏处于显示的状态
                if (!navHeaderClassList.contains('hidden')) {
                    // 博客页滚动高度要减掉header标签的高度
                    scrollHeight -= header.clientHeight;
                }
                // 隐藏或显示菜单导航栏
                navHeaderClassList.toggle('hidden', scrollHeight >= config.page.blog_scroll_height);
                // 获取页面可以滚动的高度
                const contentHeight = iframeWindow.document.body.scrollHeight - iframeWindow.innerHeight;
                // 当前滚动位置占总可滚动高度的百分比
                const scrollPercent = contentHeight > 0 ? Math.min(100 * iframeWindow.scrollY / contentHeight, 100) : 0;
                if (backToTop) {
                    backToTop.classList.toggle('back-to-top-on', Math.round(scrollPercent) >= config.back2top.scroll_percent);
                    backToTop.querySelector('span').innerText = Math.round(scrollPercent) + '%';
                }
            };
            iframeWindow.removeEventListener('scroll', scrollHandler);
            iframeWindow.addEventListener('scroll', scrollHandler);

            const clickHandler = function() {
                window.anime({
                    targets  : iframeWindow && iframeWindow.document.scrollingElement,
                    duration : 500,
                    easing   : 'linear',
                    scrollTop: 0
                });
            };
            if (backToTop) {
                backToTop.removeEventListener('click', clickHandler);
                backToTop.addEventListener('click', clickHandler);
            }

        } catch (error) {
            console.error('[blog.js] load 事件异常:', error);
        }

        // 深色模式
        if (Diversity.utils.isDarkMode()) {
            blogIframe.classList.add('dark-filter');
        }
    });

    // 最后设 src，确保 load 事件已绑定
    blogIframe.src = url;

    // 获取返回顶部按钮
    const backToTop = document.querySelector('.back-to-top');
    // 被排除主题，配置中的主题不展示返回顶部按钮
    const excludeArr = config.back2top.exclude;
    if (excludeArr && excludeArr.includes(theme)) {
        backToTop.parentNode.removeChild(backToTop);
    }
}

document.addEventListener('color-scheme:refresh', () => {
    try {
        const theme = Diversity.data.get('theme');
        const blogIframe = document.getElementById('blog');
        // 没有设置默认主题
        if (!config.themes.includes(theme))
            blogIframe.contentDocument.documentElement.classList.toggle("dark-theme");
        else
            blogIframe.classList.toggle('dark-filter');
    } catch (error) {
    }
});
