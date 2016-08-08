import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/toPromise";
import * as _ from 'lodash';

import { handleError, parseJson, packageForPost } from './http-helpers';
import { Conference, TimeSlot } from './conference.model';
import { Speaker } from './speaker.model';

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