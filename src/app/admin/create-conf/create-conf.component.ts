import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';

import { AdminService } from '../../shared/admin.service';
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
      if (endMoment.isBefore(startMoment) || endMoment.isSame(startMoment)) {
        this.toast.message("The end date must be after start date");
      } else {
        this.adminService.createConference(titleText, startText, endText);
        this.toast.message('Conference created!');
        title.value = '';
        start.value = "";
        end.value = "";
      }
    } else if (!startValid) {
      this.toast.message('Start date invalid');
    } else if (!endValid) {
      this.toast.message('End date invalid');
    }
  }


}