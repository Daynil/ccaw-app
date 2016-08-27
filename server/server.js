'use strict';

/** Get all Modules we will need **/
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const compress = require('compression');
const _ = require('lodash');
const passport = require('passport');
const expressSession = require('express-session');
require('./config/passport')(passport);

const app = express();

/** Define Variables  **/
let production = process.env.NODE_ENV === 'production';
let port = process.env.PORT || 3000;

// Load local environment variables in development
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').load();
}

/*  Configure Connection to MongoDB  **/
const mongoose = require('mongoose');
// TODO we need to change the below to use the mlab database used with heroku
let mongoURI = process.env.MONGO_URI || 'mongodb://localhost/ccaw-app';
mongoose.connect(mongoURI);

if (process.env.SEED_DB && process.env.SEED_DB==='true') {
  require('./seed');
}

/** True = get response details on served node modules **/
let verboseLogging = false;

/**  Configure middleware  **/
if (production) {
  app.use(compress());
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev', {
  skip: (req, res) => {
    if (verboseLogging) return false;
    else return req.baseUrl === '/scripts';
  }
}));
app.use( express.static( path.join(__dirname, '../dist') ));
app.use('/scripts', express.static( path.join(__dirname, '../node_modules') ));
app.use('/app', express.static( path.join(__dirname, '../dist/app') ));
app.use('/public', express.static( path.join(__dirname, '../public') ));

/** Configure Passport **/
app.use(expressSession({
                         secret: 'cookie_secret',
                         resave: false,
                         saveUninitialized: true
                       }));
app.use(passport.initialize());
app.use(passport.session());

/** Get Routes  **/
app.use('/', require('./routes'));

/**  Start Server  **/
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});