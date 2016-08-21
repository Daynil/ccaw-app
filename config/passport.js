'use strict';

var User = require('../server/models/user');
var passport = requie('passport');
let LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(request, email, password, done) {
        process.nextTick(function() {
            return User.findOne({where: {email: email, provider: 'local'}})
                .then(function(user) {
                    if (!user) {
                        return done(null, false);
                    }
                    if (!user.validatePassword(password)) {
                        return done(null, false);
                    }
                    return done(null, user);
                })
                .catch(function(error) {
                    return done(error);
                });
        });
    })
);