'use strict';
// Can't embed in speaker? Duplicate all data in each speaker?? vs simple ref to each speaker in presentation
const mongoose = require('mongoose');

let presentationSchema = new mongoose.Schema({
  type: String, // Case study or workshop - structure of multiple choice fields? in front end, dropdown or radio fields
  length: String, // 90 minutes, 3 hours (parts 1 and 2)
  title: String,
  descriptionWebsite: String,  // To appear on CCAW website and conference appear 150 word limit
  descriptionProgram: String, // To be printed on pamphlet? 60 word limit
/*  tags: {  // Check all that apply (only directly applicable)
    advocacy: Boolean,
    campusSafety: Boolean,
    coordinatedCommunityResponse: Boolean,
    culturallySpecific: Boolean,
    domesticViolence: Boolean,
    forensics: Boolean,
    humanTrafficking: Boolean,
    lawEnforcementOrInvestigation: Boolean,
    medical: Boolean,
    probationOrParole: Boolean,
    prosecution: Boolean,
    sexualAssault: Boolean,
    stalking: Boolean,
    survivorStory: Boolean,
    technology: Boolean,
    tribalIssues: Boolean
  },*/
  tags: [{
    name: String,
    applicable: Boolean
  }],
  level: String, // Beginner, Intermediate or Advanced
  willingToBeRecorded: {
    audio: Boolean,
    visual: Boolean
  },
  isMediaOrPressFriendly: String, // Yes, yes no photos, yes no audio rec or photos, no
  willingToRepeat: Boolean,
  hasCopresentor: Boolean,
  speakers: [Number] // ID numbers of presentors  
});

module.exports = mongoose.model('Presentation', presentationSchema);