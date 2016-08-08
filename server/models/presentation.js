'use strict';

const mongoose = require('mongoose');

let presentationSchema = new mongoose.Schema({
  type: String, // Case study or workshop - structure of multiple choice fields? in front end, dropdown or radio fields
  length: String, // 90 minutes, 3 hours (parts 1 and 2)
  title: String,
  descriptionWebsite: String, // To appear on CCAW website and conference appear 150 word limit
  descriptionProgram: String, // To be printed on pamphlet? 60 word limit
  tags: [{ // Option to add tags after MVP
    name: String,
    label: String, // Optional, for long tag names
    checked: Boolean
  }], 
  level: String, // beginner, intermediate or advanced - dropdown on frontend
  willingToBeRecorded: String, // audio, audioVisual, no
  isMediaOrPressFriendly: String, // yes, yesNophotos, yesNoAudioRecOrPhotos, no
  willingToRepeat: Boolean,
  hasCopresentor: Boolean,
  speakers: { // _id's of presentor and copresenters
    mainPresenter: String,
    coPresenters: [String]
  },
  statusTimeLocation: {
    conferenceTitle: String,
    date: String,
    timeSlot: String
  },
  miscRequirements: String
});