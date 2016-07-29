import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as moment from 'moment';
import * as _ from 'lodash';

import { AdminService } from '../../shared/admin.service';
import { Conference } from '../../shared/conference.model';
import { DateService } from '../../shared/date.service';
import { TransitionService } from '../../shared/transition.service';
import { ToastComponent } from '../../shared/toast.component';

@Component({
  moduleId: module.id,
  selector: 'modify-conf',
  templateUrl: 'modify-conf.component.html',
  styleUrls: ['modify-conf.component.css'],
  directives: [ToastComponent]
})
export class ModifyConfComponent implements OnInit, AfterViewInit {

  @ViewChild('toast') toast: ToastComponent;

  @ViewChild('conferences') conferencesRef: ElementRef;
  conferencesSelect: HTMLSelectElement;
  selectedConf: BehaviorSubject<Conference> = new BehaviorSubject(null);
  selectedConfDates: BehaviorSubject<string[]> = new BehaviorSubject([]);

  @ViewChild('title') title: ElementRef;
  @ViewChild('startDate') startDate: ElementRef;
  @ViewChild('endDate') endDate: ElementRef;

  constructor(private transitionService: TransitionService,
              private adminService: AdminService,
              private dateService: DateService) { }

  ngOnInit() {
    this.transitionService.transition();
  }

  ngAfterViewInit() {
    this.conferencesSelect = this.conferencesRef.nativeElement;
    this.refreshSelectedConf();
    this.fillCurrentDetails();
  }

  updateConf(currentTitle: string, title: HTMLInputElement, 
             start: HTMLInputElement, end: HTMLInputElement) {
    let newTitle = title.value;
    if (newTitle.length < 1) {
      this.toast.message('Conference must have a title');
      return;
    }
    // Input date value format: 2016-12-30
    let startText = start.value;
    let endText = end.value;
    let startMoment = moment(startText);
    let endMoment = moment(endText);
    let startValid = startMoment.isValid();
    let endValid = endMoment.isValid();
    if (startValid && endValid) {
      if (endMoment.isSameOrBefore(startMoment)) {
        this.toast.message("The end date must be after start date");
      } else {
        this.adminService
            .getAllConferences()
            .then((conferences: Conference[]) => {
              if (!this.isDuplicateTitle(conferences, newTitle, this.selectedConf.getValue().title)) {
                this.adminService.updateConference(currentTitle, newTitle, startText, endText)
                  .then(res => {
                    this.toast.message('Conference updated!');
                    this.refreshSelectedConf();
                  });
              } else {
                this.toast.message('Conference title already exists, please choose another');
              }
            })
      }
    } else if (!startValid) {
      this.toast.message('Start date invalid');
    } else if (!endValid) {
      this.toast.message('End date invalid');
    }
  }

  addTimeslot(start: HTMLInputElement, end: HTMLInputElement,
              conferences: HTMLSelectElement, dates: HTMLSelectElement) {
    let startVal = start.value;
    let endVal = end.value;
    let conferenceTitle = conferences.value;
    let date = this.dateService.formatDateForDatabase(dates.value);
    let startMoment = moment(`${date} ${startVal}`, this.dateService.timeDate, true);
    let endMoment = moment(`${date} ${endVal}`, this.dateService.timeDate, true);
    let startValid = startMoment.isValid();
    let endValid = endMoment.isValid();
    if (startValid && endValid) {
      if (endMoment.isSameOrBefore(startMoment)) {
        this.toast.message("The end time must be after start time");
      } else {
          this.adminService.addTimeslot(startVal, endVal, conferenceTitle, date)
              .then(res => {
                this.toast.message('Timeslot added!');
                start.value = "";
                end.value = "";
              });
      }
    } else if (!startValid) {
      console.log(startVal);
      this.toast.message('Start time invalid');
    } else if (!endValid) {
      this.toast.message('End time invalid');
    }
  }

  addRoom(conferences: HTMLSelectElement, roomName: HTMLInputElement) {
    let conferenceTitle = conferences.value;
    let name = roomName.value;

    if (name.length < 1) {
      this.toast.message("You must enter a room name");
      return;
    } else {
      this.adminService.addRoom(conferenceTitle, name)
          .then(res => {
            this.toast.message('Room added!');
            roomName.value = "";
          });
    }
  }

  deleteRoom(conferences: HTMLSelectElement, room: string) {
    let conferenceTitle = conferences.value;

    this.adminService.deleteRoom(conferenceTitle, room)
        .then(res => this.toast.message('Room removed!'));
  }

  refreshSelectedConf() {
    let selectedConfTitle = this.conferencesSelect.value;
    this.selectedConf.next(_.find(this.adminService.conferences, d => d.title === selectedConfTitle));
    let startMoment = moment(this.selectedConf.getValue().dateRange.start);
    let endMoment = moment(this.selectedConf.getValue().dateRange.end);
    let dates = [];
    for (let i = startMoment; i.isSameOrBefore(endMoment); i.add(1, 'd')) {
      dates.push(i.format(this.dateService.userFormat));
    }
    this.selectedConfDates.next(dates.slice());
    this.fillCurrentDetails();
  }

  fillCurrentDetails() {
    this.title.nativeElement.value = this.selectedConf.getValue().title;
    this.startDate.nativeElement.value = this.selectedConf.getValue().dateRange.start;
    this.endDate.nativeElement.value = this.selectedConf.getValue().dateRange.end;
  }

  isDuplicateTitle(conferences: Conference[], newTitle: string, currentTitle) {
    // Ignore unchanged titles
    if (newTitle === currentTitle) return false;

    let duplicateTitle = _.find(conferences, conf => conf.title.toLowerCase() === newTitle.toLowerCase());
    return typeof duplicateTitle !== 'undefined';
  }

/*  overlappingTimeslot(startTime: string, endTime: string,
                      conferenceTitle: string, date: string): boolean {
    // TODO: This doesn't validate properly yet
    let conference = _.find(this.adminService.conferences, conf => conf.title === conferenceTitle);
    let slotsForDate = _.filter(conference.timeSlots, slot => slot.date === date);
    let startMoment = moment(startTime);
    let endMoment = moment(endTime);
    let isOverlapping = false;
    slotsForDate.forEach(slot => {
      let slotStartMoment = moment(slot.timeRange.start);
      let slotEndMoment = moment(slot.timeRange.end);
      let overlappingStart = startMoment.isBetween(slotStartMoment, slotEndMoment);
      let overlappingEnd = endMoment.isBetween(slotStartMoment, slotEndMoment);
      if (overlappingStart || overlappingEnd) isOverlapping = true;
    });
    return isOverlapping;
  }*/
}