'use strict';

const path = require('path');
const Conference = require('../models/conference');
const Speaker = require('../models/speaker');
const Session = require('../models/session');
const _ = require('lodash');

module.exports = function(app, passport) {

    app.get('/api/getallconferences', (req, res) => {
        Conference
            .find({})
            .exec()
            .then(conferences => {
                res.status(200).json(conferences);
            });
    });

    app.get('/api/getallspeakers', (req, res) => {
        Speaker
            .find({})
            .exec()
            .then(speakers => {
                res.status(200).json(speakers);
            })
    });

    app.get('/api/getallsessions', (req, res) => {
        Session
            .find({})
            .exec()
            .then(sessions => {
                res.status(200).json(sessions);
            })
    });

    app.post('/api/createconference', (req, res) => {
        let conf = req.body;
        console.log('conf:', conf);
        updateActiveConfs(null).then(saveSuccess => {
            if (saveSuccess) {
                let newConf = new Conference();
                newConf.lastActive = true;
                newConf.title = conf.title;
                newConf.dateRange = {
                    start: conf.dateRange.start,
                    end: conf.dateRange.end
                };
                newConf.save(err => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({message: 'Conference save error'});
                    }
                    else res.status(200).json({message: 'Conference created'});
                });
            } else res.status(500).json({message: 'Conferences updating error'});
        });
    });

    app.post('/api/changeactiveconf', (req, res) => {
        let conf = req.body;

        updateActiveConfs(conf).then(saveSuccess => {
            if (saveSuccess) res.status(200).json({message: 'Conferences update'});
            else res.status(500).json({message: 'Conferences updating error'});
        });
    });

    app.post('/api/changetimeslot', (req, res) => {
        let conf = req.body;

        Conference
            .findOne({ title: conf.title })
            .exec()
            .then(serverConf => {
                serverConf.days = conf.days;
                serverConf.save(err => {
                    if (err) res.status(500).json({message: 'Conference save error'});
                    else res.status(200).json(serverConf);
                });
            });
    });

    app.post('/api/addRoom', (req, res) => {
        let conf = req.body;

        Conference
            .findOne({title: conf.title})
            .exec()
            .then(serverConf => {
                serverConf.rooms = conf.rooms;
                serverConf.save(err => {
                    if (err) res.status(500).json({ message: 'Conference room save error'});
                    else res.status(200).json({message: 'Conference room saved'});
                });
            });
    });

    app.post('/api/deleteRoom', (req, res) => {
        let conf = req.body;

        Conference
            .findOne({title: conf.title})
            .exec()
            .then(serverConf => {
                serverConf.rooms = conf.rooms;
                serverConf.save(err => {
                    if (err) res.status(500).json({ message: 'Conference room save error'});
                    else res.status(200).json({message: 'Conference room saved'});
                });
            });
    });

    app.post('/api/updateconference', (req, res) => {
        let currentTitle = req.body.currentTitle;
        let conf = req.body.conference;

        Conference
            .findOne({ title: currentTitle })
            .exec()
            .then(serverConf => {
                serverConf.title = conf.title;
                serverConf.dateRange = conf.dateRange;
                serverConf.save(err => {
                    if (err) res.status(500).json({message: 'Conference save error'});
                    else res.status(200).json({message: 'Conference saved'});
                });
            });
    });

    app.post('/api/updateconfrooms', (req, res) => {
        let conf = req.body;

        Conference
            .findOne({ title: conf.title })
            .exec()
            .then(serverConf => {
                serverConf.rooms = conf.rooms;
                serverConf.save(err => {
                    if (err) res.status(500).json({message: 'Conference save error'});
                    else res.status(200).json({message: 'Conference saved'});
                });
            });
    });


    app.post('/api/updatespeaker', (req, res) => {
        let speaker = req.body;
        // Existing speakers have an id
        if (speaker._id) {
            Speaker
                .findById(speaker._id)
                .exec()
                .then(serverSpeaker => {
                    if (serverSpeaker === null) {
                        console.log('Speaker not found');
                        res.status(500).json({message: 'Speaker not found'});
                    } else {
                        console.log('found existing speaker');
                        _.merge(serverSpeaker, speaker);
                        serverSpeaker.save(err => {
                            if (err) {
                                console.log(err);
                                res.status(500).json({message: 'Speaker save error'});
                            } else res.status(200).json(serverSpeaker);
                        });
                    }
                });
        } else {
            let newSpeaker = new Speaker({
                admin: false,
                password: 'password',
                status: 'pending',
                statusNotification: false,
                adminNotes: ''
            });
            _.merge(newSpeaker, speaker);
            newSpeaker.save(err => {
                if (err) {
                    console.log(err);
                    res.status(500).json({message: 'Speaker save error'});
                } else res.status(200).json(newSpeaker);
            });
        }
    });

    app.post('/api/updatesession', (req, res) => {
        let session = req.body;
        // Existing sessions have an id
        if (session._id) {
            Session
                .findById(session._id)
                .exec()
                .then(serverSession => {
                    if (serverSession === null) {
                        console.log('Session not found');
                        res.status(500).json({message: 'Session not found'});
                    } else {
                        _.merge(serverSession, session);
                        serverSession.save(err => {
                            if (err) {
                                console.log(err);
                                res.status(500).json({message: 'Session save error'});
                            } else res.status(200).json(serverSession);
                        });
                    }
                });
        } else {
            let newSession = new Session();
            _.merge(newSession, session);
            newSession.save(err => {
                if (err) {
                    console.log(err);
                    res.status(500).json({message: 'Session save error'});
                } else res.status(200).json(newSession);
            });
        }
    });

    app.post('/api/updatesessionspeakers', (req, res) => {
        let session = req.body;

        Session
            .findById(session._id)
            .exec()
            .then(serverSession => {
                if (serverSession === null) {
                    console.log('Session not found');
                    res.status(500).json({message: 'Session not found'});
                } else {
                    console.log('found existing session');
                    serverSession.speakers = session.speakers;
                    serverSession.save(err => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({message: 'Session save error'});
                        } else res.status(200).json(serverSession);
                    });
                }
            });
    });

    app.post('/api/updatesessionslots', (req, res) => {
        let session = req.body;

        Session
            .findById(session._id)
            .exec()
            .then(serverSession => {
                if (serverSession === null) {
                    console.log('Session not found');
                    res.status(500).json({message: 'Session not found'});
                } else {
                    console.log('found existing session');
                    serverSession.statusTimeLocation = session.statusTimeLocation;
                    serverSession.save(err => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({message: 'Session save error'});
                        } else res.status(200).json(serverSession);
                    });
                }
            });
    });

    /***************************************
     *
     *  Authentication routes
     *
     ***************************************/
    app.post('/login', (req, res, next) => {
        passport.authenticate('local-login', (err, user, info) => {
            if (err) return res.status(500).json({alert: err});
            if (!user) return res.status(400).json({alert: info});
            return res.status(200).json(user);
        })(req, res, next);
    });

    app.post('/signup', (req, res, next) => {
        passport.authenticate('local-signup', (err, user, info) => {
            if (err) return res.status(500).json({alert: err});
            if (!user) return res.status(400).json({alert: info});
            return res.status(200).json({alert: info});
        })(req, res, next);
    });

    app.get('/logout', (req, res) => {
        req.logout();
        res.end();
    });

    /** Pass all non-api routes to front-end router for handling **/
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../dist', 'index.html'));
    });
};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/');
}

function updateActiveConfs(activeConf) {
    // If no active conf passed, make all confs inactive
    if (activeConf === null) activeConf = {title: ''};
    let savePromise = new Promise((resolve, reject) => {
        Conference
            .find({})
            .exec()
            .then(conferences => {
                let allSavesSuccessful = true;
                for (let i = 0; i < conferences.length; i++) {
                    let serverConf = conferences[i];
                    serverConf.lastActive = serverConf.title === activeConf.title;
                    serverConf.save(err => {
                        console.log('conf saved');
                        if (err) {
                            console.log(err);
                            allSavesSuccessful = false;
                        }
                    });
                }
                resolve(allSavesSuccessful);
            });
    });
    return savePromise;
}