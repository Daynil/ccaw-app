import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/toPromise";
import * as _ from 'lodash';

import { handleError, parseJson, packageForPost } from './http-helpers';
import { AdminService } from './admin.service';
import { Conference, TimeSlot } from './conference.model';
import { Session } from './session.model';

@Injectable()
export class SessionService {

  sessions: BehaviorSubject<Session[]> = new BehaviorSubject([]);

  constructor(private http: Http,
              private adminService: AdminService) { }

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
    if (!slot._id) {
      console.log('no id on :', slot);
      return;
    }
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

  /** Assign a session to a slot and room and remove overlap if needed */
  setSession(slot: TimeSlot, room: string, sessionId: string) {
    let session = this.getSession(sessionId);
    let activeConf = this.adminService.activeConference.getValue();
    
    // Check for sessions already in requested slot before adding new
    return this.clearSlot(slot, room)
               .then(res => {
                  session.statusTimeLocation = {
                    conferenceTitle: activeConf.title,
                    timeSlot: slot._id,
                    room: room
                  };
                  return this.updateSession(session);
               });
  }

  /** Unschedule a session from a time/room slot if one exists */
  clearSlot(slot: TimeSlot, room: string) {
    let sessionInRequestedSlot = this.findSession(slot, room);
    if (typeof sessionInRequestedSlot !== 'undefined' || sessionInRequestedSlot) {
      sessionInRequestedSlot.statusTimeLocation = null;
      return this.updateSession(sessionInRequestedSlot);
    } else {
      return Promise.resolve('No scheduled session');
    }
  }

  /** Update new session on server and sync response with front end */
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