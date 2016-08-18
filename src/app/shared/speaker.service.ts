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

@Injectable()
export class SpeakerService {

  speakers: BehaviorSubject<Speaker[]> = new BehaviorSubject([]);

  constructor(private http: Http) { }

  getAllSpeakers() {
    return this.http
              .get('/api/getallspeakers')
              .toPromise()
              .then(parseJson)
              .then(allSpeakers => {
                this.speakers.next(allSpeakers);
              })
              .catch(handleError);
  }

  getSpeaker(speakerId: string) {
    return _.find(this.speakers.getValue(), speaker => speaker._id === speakerId );
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
                return serverSpeaker;
              })
              .catch(handleError);
  }

}