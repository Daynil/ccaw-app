import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import "rxjs/add/operator/toPromise";
import * as _ from 'lodash';
import * as moment from 'moment';

import { handleError, parseJson, packageForPost } from './http-helpers';
import { AdminService } from './admin.service';
import { Conference, TimeSlot } from './conference.model';
import { Speaker } from './speaker.model';
import { Session } from './session.model';

enum SessionOrder {
  Alphabetical,
  DateAdded
}

enum SessionFilter {
  None,
  Pending,
  Completed,
  Upcoming
}

@Injectable()
export class SessionService {

  sessionsUnfiltered: Session[] = [];
  sessions: BehaviorSubject<Session[]> = new BehaviorSubject([]);

  currentFilters: BehaviorSubject<{order: SessionOrder, filter: SessionFilter}> 
                  = new BehaviorSubject({order: SessionOrder.Alphabetical, filter: SessionFilter.None}); 

  constructor(private http: Http,
              private adminService: AdminService) {
    this.currentFilters.subscribe(filter => this.setFiltering());
  }

  getAllSessions() {
    return this.http
              .get('/api/getallsessions')
              .toPromise()
              .then(parseJson)
              .then(allSessions => {
                this.sessionsUnfiltered = allSessions;
                this.setFiltering();
              })
              .catch(handleError);
  }

  /** Update session display filters */
  setFiltering() {
    let unfilteredCopy = this.sessionsUnfiltered.slice();
    let filtered: Session[];

    switch (this.currentFilters.getValue().order) {
      case SessionOrder.Alphabetical:
        filtered = _.sortBy(unfilteredCopy, session => session.title);
        break;
      case SessionOrder.DateAdded:
        // Implementation
        break;
      default:
        break;
    }

    switch (this.currentFilters.getValue().filter) {
      case SessionFilter.Upcoming:
        let today = moment();
        filtered = _.filter(filtered, session => this.getSessionMoment(session))
        break;
      
      default:
        break;
    }

    this.sessions.next(filtered);
  }

  getSessionMoment(session: Session) {
    
  }

  /** Find the session assigned to room and timeslot, if any
   * @returns The session and which part for 2-parters
   */
  findSession(slot: TimeSlot, room: string) {
    if (!slot._id) {
      console.log('no id on :', slot);
      return;
    }
    let part = '';
    let session = _.find(this.sessions.getValue(), session => {
      // Skip sessions that haven't been assigned
      if (!session.statusTimeLocation || session.statusTimeLocation.length < 1) return false;
      let sameSlotAndRoom = false;
      session.statusTimeLocation.forEach(sessionOccurence => {
        if (sessionOccurence.timeSlot === slot._id
            && sessionOccurence.room === room) {
          sameSlotAndRoom = true;
          part = sessionOccurence.part;
        }
      });
      return sameSlotAndRoom;
    });
    return {session: session, part: part};
  }

  /** Get the session with a known id */
  getSession(sessionId: string) {
    return _.find(this.sessions.getValue(), session => session._id === sessionId );
  }

  /** Assign a session to a slot and room and remove overlap if needed */
  setSession(slot: TimeSlot, room: string, sessionId: string, part: string) {
    let session = this.getSession(sessionId);
    let activeConf = this.adminService.activeConference.getValue();
    
    // Check for sessions already in requested slot before adding new
    let slotOccupied = this.isSlotOccupied(slot, room);
    if (slotOccupied) return Promise.resolve({occupied: true});
    else {
      if (!session.statusTimeLocation) session.statusTimeLocation = [];
      if (this.isSessionInTimeslot(slot, session)) return Promise.resolve({alreadyScheduled: true});
      let newOccurence = {
        conferenceTitle: activeConf.title,
        timeSlot: slot._id,
        part: part,
        room: room
      };
      session.statusTimeLocation.push(newOccurence);
      return this.updateSession(session, 'slots');
    }
  }

  isSlotOccupied(slot: TimeSlot, room: string) {
    let sessionInRequestedSlot = this.findSession(slot, room).session;
    return typeof sessionInRequestedSlot !== 'undefined';
  }

  /** Returns true if session is already scheduled for a room in a timeslot */
  isSessionInTimeslot(slot: TimeSlot, session: Session) {
    let isInSlot = false;
    session.statusTimeLocation.forEach(occurrence => {
      if (occurrence.timeSlot === slot._id) isInSlot = true;
    });
    return isInSlot;
  }

  /** Unschedule a session from a time/room slot
   */
  clearSlot(slot: TimeSlot, room: string) {
    let session = this.findSession(slot, room).session;
    if (typeof session !== 'undefined' && session) {
      let occurenceToRemoveIndex;
      session.statusTimeLocation.forEach((sessionOccurence, index, arr) => {
        if (sessionOccurence.timeSlot === slot._id && sessionOccurence.room === room) {
          occurenceToRemoveIndex = index;
        }
      });
      session.statusTimeLocation.splice(occurenceToRemoveIndex, 1);
      return this.updateSession(session, 'slots');
    } else {
      return Promise.resolve('No scheduled session');
    }
  }

  assignSpeaker(speakerId: string, isLead: boolean, sessionId) {
    let session = this.getSession(sessionId);
    if (session.speakers) {
      if (isLead) {
        session.speakers.mainPresenter = speakerId;
      } else {
        let duplicate = false;
        session.speakers.coPresenters.forEach(coPresId => {
          if (coPresId === speakerId) duplicate = true;
        });
        if (!duplicate) session.speakers.coPresenters.push(speakerId);
        else return Promise.resolve({message: 'duplicate'});
      }
    } else {
      session.speakers = {
        mainPresenter: '',
        coPresenters: []
      };
      if (isLead) {
        session.speakers.mainPresenter = speakerId;
      } else {
        session.speakers.coPresenters.push(speakerId);
      }
    }
    return this.updateSession(session, 'speakers');
  }

  removeSpeaker(speakerId: string, sessionId: string) {
    let session = this.getSession(sessionId);
    if (session.speakers.mainPresenter === speakerId) {
      session.speakers.mainPresenter = '';
    } else {
      let coPresenters = session.speakers.coPresenters;
      for (let i=0; i < coPresenters.length; i++) {
        if (coPresenters[i] === speakerId) {
          session.speakers.coPresenters.splice(i, 1);
          break;
        }
      }
    }
    return this.updateSession(session, 'speakers');
  }

  /** Update new session on server and sync response with front end 
   * @updateType Different server endpoints for speaker and slot updates
  */
  updateSession(session: Session, updateType?: string) {
    let serverUrl = '/api/updatesession';
    if (updateType) serverUrl += updateType;
    let pkg = packageForPost(session);
    return this.http
              .post(serverUrl, pkg.body, pkg.opts)
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
                this.setFiltering();
                return serverSession;
              })
              .catch(handleError);
  }

}