const passport = require('koa-passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const UserModel = require('models/user.model');

passport.serializeUser(async (user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    let user = null;
    if (id === 'basic') {
        user = {
            _id: 'basic',
            provider: 'basic',
            username: 'admin'
        };
    } else {
        user = await UserModel.findById(id);
    }
    
    done(null, user);
});

async function registerUserBasic(username, password, done) {
    if (username === 'admin' && password === 'admin') {
        done(null, {
            _id: 'basic',
            provider: 'basic',
            username: 'admin'
        });
    } else {
        done(null, false);
    }
}

async function registerLocal(email, password, done){
    const user = await UserModel.findOne({ email, provider: 'local' });

    if (!user) {
        done(null, false);
        return;
    }

    const hashPassword = await bcrypt.hash(password, user.salt);

    if (hashPassword !== user.password) {
        done(null, false);
        return;
    }

    done(null, user);
}

passport.use(new BasicStrategy(registerUserBasic));

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, registerLocal));
