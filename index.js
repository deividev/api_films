const Koa = require('koa');
const koaLogger = require('koa-logger');
const logger = require('logger');
const cors = require('@koa/cors');
const body = require('koa-body');
const mount = require('koa-mount');
const filmRouter = require('routes/film.router');

const app = new Koa();

if (process.env.NODE_ENV === 'dev') {
    app.use(cors());
    app.use(koaLogger());
}

app.use(body());

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const time = Date.now() - start;
    ctx.set('X-Response-Time', `${time} ms`)
});

app.use(async (ctx, next) => {
    // console.log(`The request url is ${ctx.url}`);
    logger.debug(`The request url is ${ctx.url}`);
    // ctx.body = 'My first middleware';
    // ctx.body = { ok: 1 };
    await next();
});

// app.use(filmRouter.routes())
app.use(mount('/api/v1', filmRouter.routes()));

app.listen(3000, function (err) {
    if (err) {
        console.error('Error listening in port 3000', err);
        process.exit(1);
    }
    console.log('Koa server listening in port 3000');
});