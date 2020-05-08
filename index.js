const Koa = require('koa');
const koaLogger = require('koa-logger');
const logger = require('logger');
const cors = require('@koa/cors');
const body = require('koa-body');
const mount = require('koa-mount');
const validate = require('koa-validate');
const session = require('koa-generic-session');
const File = require('koa-generic-session-file');

// require('koa-validate')(app)
const filmRouter = require('routes/film.router');

const mongoose = require('mongoose');

const mongoUri = 'mongodb://localhost:27017/films-db';

const onDBReady = (err) => {
    if (err) {
        logger.error('Error connecting', err);
        throw new Error('Error connecting', err);
    }

    const app = new Koa();
    if (process.env.NODE_ENV === 'dev') {
        app.use(cors());
        app.use(koaLogger());
    }

    app.keys = ['claveSuperSecreta'];
    app.use(session({
        store: new File({
            sessionDirectory: __dirname + '/sessions'
        })
    }));

    // Guardar session
    app.use(async (ctx, next) => {
        logger.debug(`The request url is ${ctx.url}`);
        logger.info(`Last request was ${ctx.session.lastRequest}`);
        ctx.session.lastRequest = new Date();
        await next();
    });

    app.use(body());

    // Tiempo de respuesta
    app.use(async (ctx, next) => {
        const start = Date.now();
        await next();
        const time = Date.now() - start;
        ctx.set('X-Response-Time', `${time} ms`)
    });

    validate(app);

    app.use(mount('/api/v1', filmRouter.routes()));

    app.listen(3000, function (err) {
        if (err) {
            console.error('Error listening in port 3000', err);
            process.exit(1);
        }
        console.log('Koa server listening in port 3000');
    });
}

mongoose.connect(mongoUri,{ useNewUrlParser: true, useUnifiedTopology: true }, onDBReady);