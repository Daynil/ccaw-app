'use strict';

const mongoose = require('mongoose');

let conferenceSchema = new mongoose.Schema({
  title: String,
  dateRange: {
    start: String, // 2016-12-30
    end: String
  },
  timeSlots: [{  // Can these overlap?
    date: String,
    timeRange: {
      start: String,
      end: String
    },
    presentation: String // _id of presentation filling slot, unfilled slot if empty
  }]
});

module.exports = mongoose.model('Conference', conferenceSchema);