import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/toPromise";
import * as _ from 'lodash';

import { handleError, parseJson, packageForPost } from './http-helpers';
import { Conference, TimeSlot } from './conference.model';
import { Presentation, Speaker } from './speaker.model';

@Injectable()
export class SpeakerService {

  sessions: BehaviorSubject<Speaker[]> = new BehaviorSubject([]);

  constructor(private http: Http) { }

  getAllSessions() {
    return this.http
              .get('/api/getallsessions')
              .toPromise()
              .then(parseJson)
              .then(allSessions => {
                this.sessions.next(allSessions);
              })
              .catch(handleError);
  }

  getSession(speakerId: string) {
    return _.find(this.sessions.getValue(), session => session._id === speakerId );
  }

  updateSpeaker(speaker: Speaker) {
    let pkg = packageForPost(speaker);
    return this.http
              .post('/api/updatespeaker', pkg.body, pkg.opts)
              .toPromise()
              .then(parseJson)
              .then(serverSpeaker => {
                let newSpeakers = this.sessions.getValue();
                let existingSpeaker = _.find(newSpeakers, exSpeaker => exSpeaker._id === serverSpeaker._id);
                if (typeof existingSpeaker === 'undefined') {
                  newSpeakers.push(serverSpeaker);
                } else {
                  existingSpeaker = serverSpeaker;
                }
                this.sessions.next(newSpeakers);
                return serverSpeaker;
              })
              .catch(handleError);
  }

}