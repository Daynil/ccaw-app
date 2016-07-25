import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as moment from 'moment';

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

  constructor(private transitionService: TransitionService) { }

  ngOnInit() {
    this.transitionService.transition();
  }

  createConf(start: HTMLInputElement, end: HTMLInputElement) {
    // Input date value format: 2016-12-30
    let startVal = start.value;
    let endVal = end.value;
    let startValid = moment(startVal).isValid();
    let endValid = moment(endVal).isValid();
    if (startValid && endValid) {
      this.toast.message('Conference created!');
    } else if (!startValid) {
      this.toast.message('Start date invalid');
    } else if (!endValid) {
      this.toast.message('End date invalid');
    }
  }


}