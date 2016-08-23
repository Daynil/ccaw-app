'use strict';

var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../models/speaker');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            process.nextTick(function() {

                User.findOne({ 'email' :  email }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, 'email taken');
                    } else {

                        var newUser            = new User();
                        newUser.email    = email;
                        newUser.password = newUser.generateHash(password);
                        newUser.nameFirst = req.body.firstName;
                        newUser.nameLast = req.body.lastName;
                        newUser.save(function(err) {
                            if (err) {
                                return done(err, null, err);
                            } else {
                                return done(null, newUser, 'user created successfully');
                            }

                        });
                    }

                });

            });
        }
    ));

    passport.use('local-login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req, email, password, done) {
            User.findOne({ 'email' :  email }, function(err, user) {
                if (err){
                    return done(err);
                }

                if (!user) {
                    return done(null, false, 'no user found');
                }

                if (!user.validatePassword(password, user.password)) {
                    return done(null, false, 'wrong password');
                }
                return done(null, user, 'logged in successfully');
            });

        }
    ));

};