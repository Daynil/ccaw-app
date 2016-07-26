'use strict';

const mongoose = require('mongoose');

let conferenceSchema = new mongoose.Schema({
  title: String,
  dateRange: {
    start: String, // 2016-12-30
    end: String
  },
  // TODO restructure to new timeslots schema front and backend
  timeSlots: [{
    date: String,
    timeRanges: [{
      start: String,
      end: String
    }],
  }],
  rooms: [String]
});

module.exports = mongoose.model('Conference', conferenceSchema);