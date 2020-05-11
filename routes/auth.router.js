const Router = require("@koa/router");

class AuthRouter {
    static async showSignUp(ctx)  {
        await ctx.render('sign-up.ejs');
    }

    static async showLogin(ctx) {
        await ctx.render('login.ejs', { fail: false });
    }

    static async createUser(ctx) {
        
    }
}

const router = new Router({ prefix: '/auth' });
router.post('/sign-up', AuthRouter.createUser);
router.get('/sign-up', AuthRouter.showSignUp);
router.get('/login', AuthRouter.showLogin);

module.exports = router;