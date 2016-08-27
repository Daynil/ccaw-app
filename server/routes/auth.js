'use strict';

var router = require('express').Router();
var passport = require('passport');
const Speaker = require('../models/speaker');

router.get('/checkSession', (req, res) => {
    console.log('req auth?', req.isAuthenticated());
    console.log('req user?', req.user);
    if (req.isAuthenticated()) {
        res.status(200).json({user: req.user});
    } else {
        res.status(200).json({user: null});
    }
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local-login', (err, user, info) => {
        if (err) return res.status(500).json({alert: err});
        if (!user) return res.status(400).json({alert: info});
        return res.status(200).json(user);
    })(req, res, next);
});

router.post('/signup', (req, res, next) => {
    passport.authenticate('local-signup', (err, user, info) => {
        if (err) return res.status(500).json({alert: err});
        if (!user) return res.status(400).json({alert: info});
        return res.status(200).json({alert: info});
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.end();
});

router.post('/changePassword', (req, res) => {
    let formData = req.body.formData;
    let userId = req.body.userId;

    Speaker.findById(userId, function(err, user) {
        if (err) {
            return res.status(400).json({alert: 'user not found'});
        } else {
            user.password = user.generateHash(formData.password);
            user.save(function(err) {
                if (err) {
                    return res.status(400).json({alert: 'not saved'});
                } else {
                    return res.status(200).json({alert: 'password changed'});
                }
            });
        }
    });
    // Speaker
    //     .findById(userId)
    //     .exec()
    //     .then(user => {
    //         if (!user) {
    //             return res.status(404).json({alert: 'user not found'});
    //         } else {
    //             user.password = user.generateHash(formData.password);
    //             user.save(err => {
    //                 if (err) {
    //                     return res.status(400).json({alert: 'not saved'});
    //                 } else {
    //                     console.log('pass changed');
    //                     return res.status(200).json({alert: 'password changed'});
    //                 }
    //             });
    //         }
    //     });
});

module.exports = router;