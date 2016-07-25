'use strict';

const mongoose = require('mongoose');

let conferenceSchema = new mongoose.Schema({
  year: Number,
  dateRange: {
    start: String,
    end: String
  },
  timeSlots: [{  // Can these overlap?
    date: String,
    timeRange: {
      start: Number,
      end: Number
    },
    presentation: String // _id of presentation filling slot, unfilled slot if empty
  }]
});

module.exports = mongoose.model('Conference', conferenceSchema);