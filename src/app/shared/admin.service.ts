import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/toPromise";
import * as _ from 'lodash';

import { handleError, parseJson, packageForPost } from './http-helpers';
import { Conference, TimeSlot } from './conference.model';
import { Speaker } from './speaker.model';

@Injectable()
export class AdminService {

  conferences: Conference[] = [];
  activeConference: Conference = null;

  constructor(private http: Http) { }

  createConference(title: string, startDate: string, endDate: string) {
    this.resetActiveConfs();
    let newConf: Conference = {
      lastActive: true,
      title: title,
      dateRange: {
        start: startDate,
        end: endDate
      }
    };
    this.conferences.push(newConf);
    let pkg = packageForPost(newConf);
    return this.http
              .post('/api/createconference', pkg.body, pkg.opts)
              .toPromise()
              .then(parseJson)
              .catch(handleError);
  }

  changeActiveConf(confTitle: string) {
    let conf = _.find(this.conferences, conf => conf.title === confTitle);
    this.resetActiveConfs();
    conf.lastActive = true;
    let pkg = packageForPost(conf);
    return this.http
              .post('/api/changeactiveconf', pkg.body, pkg.opts)
              .toPromise()
              .then(parseJson)
              .catch(handleError);
  }

  resetActiveConfs() {
    this.conferences.forEach(conf => {
      conf.lastActive = false;
    });
  }

  updateConference(currentTitle: string, newTitle, startDate, endDate) {
    let conference = _.find(this.conferences, conf => conf.title === currentTitle);
    conference.title = newTitle;
    conference.dateRange = {
      start: startDate,
      end: endDate
    };
    let pkg = packageForPost({currentTitle: currentTitle, conference: conference});
    return this.http
              .post('/api/updateconference', pkg.body, pkg.opts)
              .toPromise()
              .then(parseJson)
              .catch(handleError);
  }

  addTimeslot(startTime: string, endTime: string,
              conferenceTitle: string, date: string) {
    let conference = _.find(this.conferences, conf => conf.title === conferenceTitle);
    let confDate = _.find(conference.days, day => day.date === date);
    let newTimeSlot = {start: startTime, end: endTime}
    // If day has no slots yet, make it and add the new slot
    if (typeof confDate === 'undefined') {
      let newDay = {
        date: date,
        timeSlots: [newTimeSlot]
      };
      conference.days.push(newDay);
    } else {
      confDate.timeSlots.push(newTimeSlot);
    }
    let pkg = packageForPost(conference);
    return this.http
              .post('/api/changetimeslot', pkg.body, pkg.opts)
              .toPromise()
              .then(parseJson)
              .catch(handleError);
  }

  deleteTimeSlot(date: string, confTitle: string, slot: TimeSlot) {
    let conf = _.find(this.conferences, conf => conf.title === confTitle);
    let confDate = _.find(conf.days, day => day.date === date);
    
    // Sync front end
    let slotIndex = _.findIndex(confDate.timeSlots, existSlot => existSlot === slot);
    confDate.timeSlots.splice(slotIndex, 1);

    let pkg = packageForPost(conf);
    return this.http
              .post('/api/changetimeslot', pkg.body, pkg.opts)
              .toPromise()
              .then(parseJson)
              .catch(handleError);
  }

  addRoom(conferenceTitle: string, room: string) {
    let conf = _.find(this.conferences, conf => conf.title === conferenceTitle);

    // Sync front end
    conf.rooms.push(room);

    let pkg = packageForPost(conf);
    return this.http
        .post('/api/addRoom', pkg.body, pkg.opts)
        .toPromise()
        .then(parseJson)
        .catch(handleError);
  }

  deleteRoom(conferenceTitle: string, room: string) {
    let conf = _.find(this.conferences, conf => conf.title === conferenceTitle);
    
    // Sync front end
    conf.rooms.splice(conf.rooms.indexOf(room), 1);

    let pkg = packageForPost(conf);
    return this.http
        .post('/api/deleteRoom', pkg.body, pkg.opts)
        .toPromise()
        .then(parseJson)
        .catch(handleError);
  }

  getAllConferences() {
    return this.http
              .get('/api/getallconferences')
              .toPromise()
              .then(parseJson)
              .then(conferences => {
                this.conferences = conferences;
                return conferences;
              })
              .catch(handleError);
  }
  
}