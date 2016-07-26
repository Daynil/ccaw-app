import { Component, OnInit } from '@angular/core';

import { TransitionService } from '../../shared/transition.service';

@Component({
  moduleId: module.id,
  selector: 'modify-conf',
  templateUrl: 'modify-conf.component.html',
  styleUrls: ['modify-conf.component.css']
})
export class ModifyConfComponent implements OnInit {

  constructor(private transitionService: TransitionService) { }

  ngOnInit() {
    this.transitionService.transition();
  }

  addTimeslot(start: HTMLInputElement, end: HTMLInputElement) {
    let startVal = start.value;
    let endVal = end.value;
    let conference = conferences.value;  // is this right for a select
    let startValid = moment(startVal).isValid();
    let endValid = moment(endVal).isValid();
    if (startValid && endValid) {
      if (endVal < startVal) {
        this.toast.message("The end date must be after start date");
      } else {
        this.adminService.addTimeslot(startVal, endVal, conference);
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

}