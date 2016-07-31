export interface Speaker {

  // _id field, grabbed from mongoose if speaker existed
  _id?: string;

  // Credentials

  admin: boolean,
  password: string,
  salutation: string,
  nameFirst: string,
  nameLast: string,
  /** Unique required */
  email: string,

  // Speaker information

  status: {
    type: string,
    default: 'pending'
  }, // pending, accepted, denied, notifed: boolean
  statusNotification: boolean,  // After accepting/denying, whether they were notified
  title: string,
  organization: string,
  address1: string, // Do we need line1/line2? or break down to number/street? Account for PO box?
  address2?: string,
  city: string,
  state: string,
  zip: string,
  phoneWork: string,
  phoneCell: string,
  assistantOrCC?: string, // Not sure what this is, not required
  bioWebsite: string, // For website/app, 125 word limit
  bioProgram: string, // For pamphlet/printed program, 60 word limit
  headshot: string, // file handling ourselves (typeform has drag/drop file selection) sanitize extensions after MVP, min/max size
  mediaWilling: boolean,
  costsCoveredByOrg: string[],  // In form: Travel/Lodging/None check all that apply
  speakingFees: string, // Not sure if we need a number? Selectable from dropdown?
  hasPresentedAtCCAWInPast2years: boolean,
  recentSpeakingExp: string,
  speakingReferences: string,  // At least 2
  adminNotes: string,
  coPresenters: string[],

  // Presentations speaker is involved in
  presentations: Presentation[]
}

export interface Presentation {
    presentationID: number,  // non-mongoID ID to reference to access duplicate copies (make this a unique GUID)
    type: string, // Case study or workshop - structure of multiple choice fields? in front end, dropdown or radio fields
    length: string, // 90 minutes, 3 hours (parts 1 and 2)
    title: string,
    descriptionWebsite: string,  // To appear on CCAW website and conference appear 150 word limit
    descriptionProgram: string, // To be printed on pamphlet? 60 word limit
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
    tags: string[], // Option to add tags after MVP
    level: string, // Beginner, Intermediate or Advanced - dropdown on frontend
    willingToBeRecorded: {
      audio: boolean,
      visual: boolean
    },
    isMediaOrPressFriendly: string, // Yes, yes no photos, yes no audio rec or photos, no
    willingToRepeat: boolean,
    hasCopresentor: boolean,
    speakers: string[], // emails of presentors  
    statusTimeLocation: {
      conferenceTitle: string,
      timeSlot: {
        start: string,
        end: string
      },
      room: string
    },
    miscRequirements: String
}