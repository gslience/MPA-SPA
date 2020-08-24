const moduleAlias = require("module-alias");
moduleAlias.addAliases({
    '@root'  : __dirname,
    '@controllers': __dirname + '/controllers',
    '@models': __dirname + '/models'
});

const Koa = require('koa');
const render = require('koa-swig');
const config = require('./config');
const co = require('co');
const log4js = require("log4js");
const  errorHandler = require('./middleware/errorHandler');

const { historyApiFallback } = require('koa2-connect-history-api-fallback');


const app = new Koa();
const serve = require("koa-static");

log4js.configure({
    appenders: { cheese: { type: "file", filename: "./logs/test.log" } },
    categories: { default: { appenders: ["cheese"], level: "error" } }
});

const logger = log4js.getLogger("cheese");
// logger.error('错误日志');

// 设置静态资源路径
app.use(serve(config.staticDir));

// 真假路由结合的bug
app.use(historyApiFallback({index: '/', whiteList: ['/api/list']}));


// 模板渲染
app.context.render = co.wrap(render({
    root: config.viewDir,
    autoescape: true,
    cache: process.env.NODE_ENV === "development" ? false : 'memory', // disable, set to false
    ext: 'html',
    varControls: ['[[', ']]'],
    writeBody: false
}));
// 错误日志处理
errorHandler.error(app, logger);

// 路由注册中心
require("./controllers")(app);

app.listen(config.port, () => {
    console.log('服务启动成功');
})