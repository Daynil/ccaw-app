'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

let addressSchema = new mongoose.Schema({
  address: String,
  city: String,
  state: String,
  zip: String
});

let speakerSchema = new mongoose.Schema({

  // Credentials
  admin: {
    type: Boolean,
    default: false
  },
  password: String,
  salutation: String,
  nameFirst: {
    type: String,
    required: true
  },
  nameLast: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },

  // Speaker information
  status: {
    type: String,
    default: 'pending'
  }, // pending, accepted, denied, notifed: boolean
  statusNotification: Boolean,  // After accepting/denying, whether they were notified
  title: String,
  organization: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  zip: String,
  phoneWork: String,
  phoneCell: String,
  assistantOrCC: String, // Not sure what this is, not required
  bioWebsite: String, // For website/app, 125 word limit
  bioProgram: String, // For pamphlet/printed program, 60 word limit
  headshot: String, // file handling ourselves (typeform has drag/drop file selection) sanitize extensions after MVP, min/max size
  mediaWilling: Boolean,
  costsCoveredByOrg: [{ // In form: Travel/Lodging/None check all that apply
    name: String,
    covered: Boolean
  }],
  speakingFees: String, // Not sure if we need a number? Selectable from dropdown?
  hasPresentedAtCCAWInPast2years: Boolean,
  recentSpeakingExp: String,
  speakingReferences: String, // At least 2
  adminNotes: String,
  coPresenters: [String],

  // Presentations speaker is involved in
  presentations: [{
    presentationID: Number,  // non-mongoID ID to reference to access duplicate copies (make this a unique GUID)
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
    tags: [String], // Option to add tags after MVP
    level: String, // Beginner, Intermediate or Advanced - dropdown on frontend
    willingToBeRecorded: {
      audio: Boolean,
      visual: Boolean
    },
    isMediaOrPressFriendly: String, // Yes, yes no photos, yes no audio rec or photos, no
    willingToRepeat: Boolean,
    hasCopresentor: Boolean,
    speakers: [Number], // _id's of presentors  
    statusTimeLocation: {
      conferenceTitle: String,
      timeSlot: {
        start: String,
        end: String
      },
      room: String
    },
    miscRequirements: String
  }]
});

speakerSchema.methods.generateHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

speakerSchema.methods.validatePassword = (enteredPass, actualPassHash) => {
  return bcrypt.compareSync(enteredPass, actualPassHash);
};

module.exports = mongoose.model('Speaker', speakerSchema);