'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compress = require('compression');
const _ = require('lodash');

const app = express();

// Load local environment variables in development
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').load();
}
let production = process.env.NODE_ENV === 'production';

if (process.env.SEED_DB && process.env.SEED_DB==='true') {
  require('./seed');
}

// Database
const mongoose = require('mongoose');
const Conference = require('./models/conference');
const Speaker = require('./models/speaker');
const Presentation = require('./models/presentation');
let mongoURI = process.env.MONGO_URI || 'mongodb://localhost/ccaw-app';
mongoose.connect(mongoURI);

function updateActiveConfs(activeConf) {
  // If no active conf passed, make all confs inactive
  if (activeConf === null) activeConf = {title: ''};
  let savePromise = new Promise((resolve, reject) => {
    Conference
      .find({})
      .exec()
      .then(conferences => {
        let allSavesSuccessful = true;
        conferences.forEach(serverConf => {
          if (serverConf.title === activeConf.title) {
            serverConf.lastActive = true;
          } else {
            serverConf.lastActive = false;
          }
          serverConf.save(err => {
            if (err) {
              console.log(err);
              allSavesSuccessful = false;
            }
          });
          resolve(allSavesSuccessful);
        });
      });
  });
  return savePromise;
}

/** True = get response details on served node modules **/
let verboseLogging = false;

/** Gzip files in production **/
if (production) {
  app.use(compress());
}

app.use(bodyParser.json());

app.use(morgan('dev', {
  skip: (req, res) => {
    if (verboseLogging) return false;
    else return req.baseUrl === '/scripts';
  }
}));

app.use( express.static( path.join(__dirname, '../dist') ));

app.use('/scripts', express.static( path.join(__dirname, '../node_modules') ));
app.use('/app', express.static( path.join(__dirname, '../dist/app') ));

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
  Presentation
    .find({})
    .exec()
    .then(sessions => {
      res.status(200).json(sessions);
    })
});

app.post('/api/createconference', (req, res) => {
  let conf = req.body;

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
        else res.status(200).json({message: 'Conference saved'});
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
    Presentation
      .findById(session._id)
      .exec()
      .then(serverSession => {
        if (serverSession === null) {
          console.log('Session not found');
          res.status(500).json({message: 'Session not found'});
        } else {
          console.log('found existing session');
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
    let newSession = new Presentation();
    _.merge(newSession, session);
    newSession.save(err => {
      if (err) {
        console.log(err);
        res.status(500).json({message: 'Session save error'});
      } else res.status(200).json(newSession);
    });
  }
});

/** Pass all non-api routes to front-end router for handling **/
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
});

let port = process.env.PORT || 3000;
let server = app.listen(port, () => console.log(`Listening on port ${port}...`));