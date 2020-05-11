const Router = require("@koa/router");
const bcrypt = require('bcrypt');
const UserModel = require('models/user.model');

class AuthRouter {
    static async showSignUp(ctx)  {
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
}

const router = new Router({ prefix: '/auth' });
router.post('/sign-up', AuthRouter.createUser);
router.get('/sign-up', AuthRouter.showSignUp);
router.get('/login', AuthRouter.showLogin);

module.exports = router;