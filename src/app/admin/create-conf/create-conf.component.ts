import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';

import { AdminService } from '../../shared/admin.service';
import { Conference } from '../../shared/conference.model';
import { TransitionService } from '../../shared/transition.service';
import { ToastComponent } from '../../shared/toast.component';

@Component({
  moduleId: module.id,
  selector: 'create-conf',
  templateUrl: 'create-conf.component.html',
  styleUrls: ['create-conf.component.css'],
  directives: [ToastComponent]
})
export class CreateConfComponent implements OnInit {

  @ViewChild('toast') toast: ToastComponent;

  constructor(private transitionService: TransitionService,
              private adminService: AdminService) { }

  ngOnInit() {
    this.transitionService.transition();
  }

  createConf(title: HTMLInputElement, start: HTMLInputElement, end: HTMLInputElement) {
    let titleText = title.value;
    if (titleText.length < 1) {
      this.toast.message('Create a title for your conference');
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
              if (!this.isDuplicateTitle(conferences, titleText)) {
                this.adminService.createConference(titleText, startText, endText);
                this.toast.message('Conference created!');
                title.value = '';
                start.value = "";
                end.value = "";
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

  isDuplicateTitle(conferences: Conference[], title: string) {
    let duplicateTitle = _.find(conferences, function(d) {
      return d.title.toLowerCase() === title.toLowerCase();
    });
    return typeof duplicateTitle !== 'undefined';
  }

}