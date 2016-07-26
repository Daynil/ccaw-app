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
  selectedConf: Conference;
  selectedConfDates: BehaviorSubject<string[]> = new BehaviorSubject([]);

  constructor(private transitionService: TransitionService,
              private adminService: AdminService,
              private dateService: DateService) { }

  ngOnInit() {
    this.transitionService.transition();
  }

  ngAfterViewInit() {
    this.conferencesSelect = this.conferencesRef.nativeElement;
    this.refreshSelectedConf();
  }

  addTimeslot(start: HTMLInputElement, end: HTMLInputElement, 
              conferences: HTMLSelectElement, dates: HTMLSelectElement) {
    let startVal = start.value;
    let endVal = end.value;
    let conferenceTitle = conferences.value;
    let date = this.dateService.formatDateForDatabase(dates.value);
    let startMoment = moment(`${date} ${startVal}`, this.dateService.timeDate);
    let endMoment = moment(`${date} ${endVal}`, this.dateService.timeDate);
    let startValid = startMoment.isValid();
    let endValid = endMoment.isValid();
    if (startValid && endValid) {
      if (endMoment.isSameOrBefore(startMoment)) {
        this.toast.message("The end time must be after start time");
      } else {
/*        if (this.overlappingTimeslot(startVal, endVal, conferenceTitle, date)) {
          this.toast.message('Timeslot overlaps with existing slot!');
        } else {*/
          this.adminService.addTimeslot(startVal, endVal, conferenceTitle, date);
          this.toast.message('Timeslot added!');
          start.value = "";
          end.value = "";
        //}
      }
    } else if (!startValid) {
      console.log(startVal);
      this.toast.message('Start time invalid');
    } else if (!endValid) {
      this.toast.message('End time invalid');
    }
  }

  refreshSelectedConf() {
    let selectedConfTitle = this.conferencesSelect.value;
    this.selectedConf = _.find(this.adminService.conferences, d => d.title === selectedConfTitle);
    let startMoment = moment(this.selectedConf.dateRange.start);
    let endMoment = moment(this.selectedConf.dateRange.end);
    let dates = [];
    for (let i = startMoment; i.isSameOrBefore(endMoment); i.add(1, 'd')) {
      dates.push(i.format(this.dateService.userFormat));
    }
    this.selectedConfDates.next(dates.slice());
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