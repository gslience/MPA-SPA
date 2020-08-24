const errorHandler = {
    error(app, logger) {
        app.use(async (ctx, next) => {
            
            try{
                await next();
            } catch (error) {
                logger.error(error);
                ctx.status = ctx.status || 500;
                ctx.body = '500请求了';
            }
        });
        app.use(async (ctx, next) => {
            await next();
            if (404 !== ctx.status) {
                return;
            }
            ctx.status = 404;
            // homePageUrl="http://yoursite.com/yourPage.html" homePageName="回到我的主页"
            ctx.body = `<script type="text/javascript" src="//qzonestyle.gtimg.cn/qzone/hybrid/app/404/search_children.js" charset="utf-8"></script>`
        });
    }
}

module.exports = errorHandler;