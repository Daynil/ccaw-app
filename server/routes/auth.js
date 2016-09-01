'use strict';

const router = require('express').Router();
const passport = require('passport');
const Speaker = require('../models/speaker');
const async = require('async');
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
     user: process.env.EMAIL,
     pass: process.env.PASSWORD
    }
});



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
        if (!user) return res.status(401).json({alert: info});
        return res.status(200).json(user);
    })(req, res, next);
});

router.post('/signup', (req, res, next) => {
    passport.authenticate('local-signup', (err, user, info) => {
        if (err) return res.status(500).json({alert: err});
        if (!user) {
            if (info === 'email taken') {
                return res.status(409).json({alert: info});
            } else return res.status(400).json({alert: info});
        }
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
});

router.post('/forgotpassword', (req, res) => {
    let formData = req.body.formData;
    let chars = "abcdefghijklmnopqrstuvwxyz123456789";
    let newPass = '';

    for (var i = 0; i < 10; i++){
        newPass += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    Speaker.findOne({email: formData.email}, function (err, user) {
        if (err) {
            return res.status(404).json({alert: 'email not found'})
        }
        user.password = user.generateHash(newPass);
        user.save(function(err) {
            if (err){
                return res.status(400).json({alert: 'password not saved'});
            } else {
                var mailOptions = {
                    from: 'Jennifer Bland <ratracegrad@gmail.com>', // TODO update with CCAW sender address
                    to: formData.email,
                    subject: 'New CCAW password.', // Subject line
                    html: '<b>Your new password is ' + newPass + '.  </b><a href="http://localhost:3000/login">Login here.</a>' // TODO change to URL for deployment
                };

                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        return res.status(400).json({alert: 'not sent'});
                    }else{
                        return res.status(200).json({alert: 'password sent'});
                    }
                });
            }
        });
    });

    return newPass;

});

module.exports = router;