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

  addTimeslot(start: HTMLInputElement, end: HTMLInputElement, conferences: HTMLSelectElement) {
    let startVal = start.value;
    let endVal = end.value;
    let conferenceTitle = conferences.value;
    let startMoment = moment(startVal);
    let endMoment = moment(endVal);
    let startValid = startMoment.isValid();
    let endValid = endMoment.isValid();
    if (startValid && endValid) {
      if (endMoment.isSameOrBefore(startMoment)) {
        this.toast.message("The end time must be after start time");
      } else {
        this.adminService.addTimeslot(startVal, endVal, conferenceTitle);
        this.toast.message('Timeslot added!');
        start.value = "";
        end.value = "";
      }
    } else if (!startValid) {
      this.toast.message('Start time invalid');
    } else if (!endValid) {
      this.toast.message('End time invalid');
    }
  }

  refreshSelectedConf() {
    console.log('called refresh');
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

}