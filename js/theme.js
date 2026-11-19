(function($){
    document.body.classList.remove('bg-color');
    document.body.classList.add('bg-img');
    document.body.classList.add('touch-none');
    
    const COOKIE_NAME = 'theme';

    // 【设为默认/取消默认】按钮点击事件
    $('.theme-default').on('click', function() {
        const thiz = $(this);
        const theme = Diversity.data.get(COOKIE_NAME);
        const curTheme = thiz.parent('p').attr('theme');
        // 没有设置默认主题 或者 已设置默认主题，但不是当前主题
        if (!theme || (theme && theme != curTheme)) {
            var expirationDate = new Date();
            // 设置默认主题为当前所在主题
            Diversity.data.set(COOKIE_NAME, curTheme);
            // 设置主题标志，1：设置过主题 0：没有设置过
            Diversity.data.setIfNotAbsent('theme_flag', 1);
            // 获取当前 URL 参数
            const curSearch = window.location.search;
            let blogUrl = config.menu.blog;
            // 将当前参数追加到博客页跳转链接
            if (curSearch) {
                blogUrl += (blogUrl.indexOf('?') === -1 ? curSearch : curSearch.replace('?', '&'));
            }
            $.gritter.add({
                title: Diversity.data.convert(config.gritter.title_theme, curTheme),
                text: config.gritter.text_configured + ' <a class="gritter-link" href="' 
                    + blogUrl + '">' + config.gritter.text_clicktojump + '</a>',
                time: 4000,
                image: config.gritter.image,
                class_name: 'gritter-success gritter-light'
            });
        } else if (theme && theme == curTheme) {
            // 已设置默认主题，并且就是当前主题，则认为是取消默认
            Diversity.data.remove(COOKIE_NAME);
            $.gritter.add({
                title: Diversity.data.convert(config.gritter.title_theme, theme),
                text: config.gritter.text_canceled,
                time: 4000,
                image: config.gritter.image,
                class_name: 'gritter-warning gritter-light'
            });
        } 
        // 遍历所有的含主题的卡片div，设置【设为默认/取消默认】的展示文本
        initCardButtonText();
    });

    // 遍历所有的含主题的卡片div，设置【设为默认/取消默认】的展示文本
    initCardButtonText();

    function initCardButtonText() {
        $('.card').each(function() {
            const thiz = $(this);
            const button = thiz.find('button.theme-default');
            const theme = Diversity.data.get(COOKIE_NAME);
            const curTheme = button.parent('p').attr('theme');
            if (!theme || theme != curTheme) {
                // 按钮文本改为设为默认
                button.text(config.button.theme_default);
                button.removeClass('btn-default').addClass('btn-primary');
            } else {
                // 按钮文本改为取消默认
                button.text(config.button.cancel_default);
                button.removeClass('btn-primary').addClass('btn-default');
            }
        });
    }

    // 主题直达按钮点击事件
    $('.theme-redirect').on('click', function() {
        const theme = $(this).parent('p').attr('theme');
        window.open(Diversity.browser.getThemeUrl(theme).href, "_blank");
    });

    // 主题来源按钮点击事件
    $('.theme-source').on('click', function() {
        const theme = $(this).parent('p').attr('theme');
        const source = config.source[theme];
        if (source)
            window.open(source, "_blank");
    });

})(jQuery);
