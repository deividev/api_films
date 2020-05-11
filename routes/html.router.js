const logger = require('logger');
const Router = require('@koa/router');


class HtmlRouter {
    static async home(ctx) {
        await ctx.render('index.ejs', {
            // text: ctx.query.text || 'Empty'
            text: ctx.params.id || 'Empty'
        });
    }
}

const router = new Router({});

router.get('/:id*', HtmlRouter.home);
module.exports = router;