import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/toPromise";
import * as _ from 'lodash';

import { handleError, parseJson, packageForPost } from './http-helpers';
import { Conference, TimeSlot } from './conference.model';
import { Session } from './session.model';
import { Speaker } from './speaker.model';

export interface SpeakerList {
  mainPresenter: Speaker;
  coPresenters: Speaker[];
}

enum SpeakerOrder {
  Alphabetical,
  DateJoined
}

enum SpeakerFilter {
  None,
  HasPresentations,
  IncompleteProfile
}

@Injectable()
export class SpeakerService {

  speakersUnfiltered: Speaker[] = [];
  speakers: BehaviorSubject<Speaker[]> = new BehaviorSubject([]);

  currentFilters: BehaviorSubject<{order: SpeakerOrder, filter: SpeakerFilter}>
                  = new BehaviorSubject({order: SpeakerOrder.Alphabetical, filter: SpeakerFilter.None}); 


  constructor(private http: Http) {
    this.currentFilters.subscribe(filter => this.setFiltering());
  }

  getAllSpeakers() {
    return this.http
              .get('/api/getallspeakers')
              .toPromise()
              .then(parseJson)
              .then(allSpeakers => {
                this.speakersUnfiltered = allSpeakers;
                this.setFiltering();
              })
              .catch(handleError);
  }

  getSpeaker(speakerId: string) {
    return _.find(this.speakers.getValue(), speaker => speaker._id === speakerId );
  }

  /** Update speaker display filters */
  setFiltering() {
    let unfilteredCopy = this.speakersUnfiltered.slice();
    let filtered: Speaker[];

    switch (this.currentFilters.getValue().order) {
      case SpeakerOrder.Alphabetical:
        filtered = _.sortBy(unfilteredCopy, speaker => speaker.nameLast);
        break;
      case SpeakerOrder.DateJoined:
        // Implementation
        break;
      default:
        break;
    }

    switch (this.currentFilters.getValue().filter) {
      case SpeakerFilter.HasPresentations:
        break;
      
      default:
        break;
    }

    this.speakers.next(filtered);
  }


  /** Get a list of speaker objects from a list of speaker ID's */
  getSpeakerList(speakerIdList): SpeakerList {
    let speakers: SpeakerList = <SpeakerList>{};
    speakers.mainPresenter = this.getSpeaker(speakerIdList.mainPresenter);
    speakers.coPresenters = [];
    speakerIdList.coPresenters.forEach(coPresId => {
      speakers.coPresenters.push(this.getSpeaker(coPresId));
    });
    return speakers;
  }

  updateSpeaker(speaker: Speaker) {
    let pkg = packageForPost(speaker);
    return this.http
              .post('/api/updatespeaker', pkg.body, pkg.opts)
              .toPromise()
              .then(parseJson)
              .then(serverSpeaker => {
                let newSpeakers = this.speakers.getValue();
                let existingSpeaker = _.find(newSpeakers, exSpeaker => exSpeaker._id === serverSpeaker._id);
                if (typeof existingSpeaker === 'undefined') {
                  newSpeakers.push(serverSpeaker);
                } else {
                  existingSpeaker = serverSpeaker;
                }
                this.speakers.next(newSpeakers);
                this.setFiltering();
                return serverSpeaker;
              })
              .catch(handleError);
  }

}