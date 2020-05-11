const Router = require("@koa/router");
const bcrypt = require('bcrypt');
const UserModel = require('models/user.model');
const passport = require('koa-passport');

class AuthRouter {
    static async showSignUp(ctx) {
        await ctx.render('sign-up.ejs');
    }

    static async showLogin(ctx) {
        await ctx.render('login.ejs', { fail: false });
    }

    static async createUser(ctx) {
        const salt = await bcrypt.genSalt();
        const password = await bcrypt.hash(ctx.request.body.password, salt);

        await new UserModel({
            email: ctx.request.body.email,
            provider: 'local',
            salt,
            password
        }).save();

        ctx.redirect('/auth/login');
    }

    static async success(ctx) {
        //await ctx.render('index.ejs', { text: 'Authenticated!!!!' });
        ctx.body = ctx.state.user;
    }

    static async fail(ctx) {
        await ctx.render('login.ejs', { fail: true });
    }
}

const router = new Router({ prefix: '/auth' });
router.post('/sign-up', AuthRouter.createUser);
router.get('/sign-up', AuthRouter.showSignUp);
router.get('/login', AuthRouter.showLogin);

/*router.post('/login', passport.authenticate('local', {
    successRedirect: '/auth/success',
    failureRedirect: '/auth/fail'
}));*/

router.post(
    '/login', 
    passport.authenticate('local'), 
    async (ctx) => {
        ctx.body = ctx.state.user;
    }
)

router.get('/success', AuthRouter.success);
router.get('/fail', AuthRouter.fail);

module.exports = router;