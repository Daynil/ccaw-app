'use strict';

const mongoose = require('mongoose');

let conferenceSchema = new mongoose.Schema({
  lastActive: Boolean,
  title: String,
  dateRange: {
    start: String, // 2016-12-30
    end: String
  },
  days: [{
    date: String,
    timeSlots: [{
      start: String,
      end: String,
      presentation: String, // Presentation id, or none for unassigned
      room: String
    }]
  }],
  rooms: [String]
});

module.exports = mongoose.model('Conference', conferenceSchema);