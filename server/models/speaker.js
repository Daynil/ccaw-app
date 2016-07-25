'use strict';

const mongoose = require('mongoose');

let speakerSchema = new mongoose.Schema({
  salutation: String,
  nameFirst: String,
  nameLast: String,
  title: String,
  organization: String,
  address: String, // Do we need line1/line2? or break down to number/street?
  city: String,
  state: String,
  zip: Number,
  phoneWork: String,
  phoneCell: String,
  email: String,
  assistantOrCC: String, // Not sure what this is
  bioWebsite: String, // For website/app, 125 word limit
  bioProgram: String, // For pamphlet/printed program, 60 word limit
  headshot: String, // upload as url vs file handling ourselves (typeform has drag/drop file selection)
  willingToBeInterviewdByMedia: Boolean,
  costsCoveredByOrganization: [{  // In form: Travel/Lodging/None check all that apply
    cost: String,
    covered: Boolean
  }],
  speakingFees: String, // Not sure if we need a number? Selectable from dropdown?
  hasPresentedAtCCAWInPast2years: Boolean,
  recentSpeakingExperience: String,
  speakingRefrences: [{  // At least 2
    nameRef: String,
    city: String,
    state: String,
    phone: String,
    email: String
  }]
});

module.exports = mongoose.model('Speaker', speakerSchema);