'use strict';

var LocalStrategy   = require('passport-local').Strategy;
var User            = require('../models/user');

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
            console.log('passport local-signup');
            process.nextTick(function() {

                User.findOne({ 'email' :  email }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        var newUser            = new User();
                        newUser.email    = email;
                        newUser.password = newUser.generateHash(password);
                        newUser.firstName = req.body.firstName;
                        newUser.lastName = req.body.lastName;
                        newUser.save(function(err) {
                            if (err) {
                                return done(err);
                            } else {
                                return done(null, newUser);
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
            console.log('eamil: ', email, 'pass', password);
            User.findOne({ 'email' :  email }, function(err, user) {
                if (err){
                    console.log('email find err', err);
                    return done(err);
                }

                if (!user) {
                    console.log('no user found');
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                }

                if (!user.validatePassword(password)) {
                    console.log('wrong pass');
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                }
                console.log('good to go');
                return done(null, user);
            });

        }
    ));

};