export interface Session {
    _id?: string,
    type: string, // Case study or workshop - structure of multiple choice fields? in front end, dropdown or radio fields
    length: string, // 90 minutes, 3 hours(180 minutes) (parts 1 and 2)
    title: string,
    descriptionWebsite: string,  // To appear on CCAW website and conference appear 150 word limit
    descriptionProgram: string, // To be printed on pamphlet? 60 word limit
    tags: { // Option to add tags after MVP
      name: string,
      label?: string,
      checked: boolean
    }[], 
    level: string, // beginner, intermediate or advanced - dropdown on frontend
    willingToBeRecorded: string, // audio, audioVisual, no
    isMediaOrPressFriendly: string, // yes, yesNoPhotos, yesNoAudioRecOrPhotos, no
    willingToRepeat: boolean,
    hasCopresentor: boolean,
    speakers?: { // _id's of presentor and copresenters
      mainPresenter: string,
      coPresenters: string[]
    },
    statusTimeLocation?: {
      conferenceTitle: string,
      timeSlot: string, // _id of timeslot
      room: string
    }[],
    miscRequirements?: String
}