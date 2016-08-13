import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/toPromise";
import * as _ from 'lodash';

import { handleError, parseJson, packageForPost } from './http-helpers';
import { Conference, TimeSlot } from './conference.model';
import { Session } from './session.model';

@Injectable()
export class SessionService {

  sessions: BehaviorSubject<Session[]> = new BehaviorSubject([]);

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

  /** Find the session assigned to room and timeslot, if any */
  findSession(slot: TimeSlot, room: string) {
    return _.find(this.sessions.getValue(), session => {
      // Skip sessions that haven't been assigned
      if (!session.statusTimeLocation) return false;
      let sameSlot = session.statusTimeLocation.timeSlot === slot._id;
      let sameRoom = session.statusTimeLocation.room === room;
      return sameRoom && sameSlot;
    });
  }

  /** Get the session with a known id */
  getSession(sessionId: string) {
    return _.find(this.sessions.getValue(), session => session._id === sessionId );
  }

  updateSession(session: Session) {
    let pkg = packageForPost(session);
    return this.http
              .post('/api/updatesession', pkg.body, pkg.opts)
              .toPromise()
              .then(parseJson)
              .then(serverSession => {
                let newSessions = this.sessions.getValue();
                let existingSession = _.find(newSessions, exSession => exSession._id === serverSession._id);
                if (typeof existingSession === 'undefined') {
                  newSessions.push(serverSession);
                } else {
                  existingSession = serverSession;
                }
                this.sessions.next(newSessions);
                return serverSession;
              })
              .catch(handleError);
  }

}