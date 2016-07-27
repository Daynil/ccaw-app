import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/toPromise";
import * as _ from 'lodash';

import { handleError, parseJson, packageForPost } from './http-helpers';
import { Conference, TimeSlot } from './conference.model';

@Injectable()
export class AdminService {

  conferences: Conference[] = [];
  activeConference: Conference = null;
  timeslots: TimeSlot[] = [];

  constructor(private http: Http) { }

  createConference(title: string, startDate: string, endDate: string) {
    let newConf: Conference = {
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

  addTimeslot(startTime: string, endTime: string,
              conferenceTitle: string, date: string) {
    let conference = _.find(this.conferences, conf => conf.title === conferenceTitle);
    let newTimeslot: TimeSlot = {
      date: date,
      timeRange: {
        start: startTime,
        end: endTime
      }
    };
    conference.timeSlots.push(newTimeslot);
    let pkg = packageForPost(conference);
    return this.http
              .post('/api/addtimeslot', pkg.body, pkg.opts)
              .toPromise()
              .then(parseJson)
              .catch(handleError);
  }

  addRoom(conferenceTitle: string, name: string) {
    let newRoom = {
      title: conferenceTitle,
      name: name
    };
    
    let pkg = packageForPost(newRoom);
    return this.http
        .post('/api/addRoom', pkg.body, pkg.opts)
        .toPromise()
        .then(parseJson)
        .catch(handleError);
  }

  updateConference(startDate: string, endDate: string,
                   timeSlots: TimeSlot[]) {


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