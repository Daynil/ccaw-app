import { Component, OnInit, ViewChild } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { AdminService } from '../../shared/admin.service';
import { TransitionService } from '../../shared/transition.service';
import { ToastComponent } from '../../shared/toast.component';

@Component({
  moduleId: module.id,
  selector: 'select-active',
  templateUrl: 'select-active.component.html',
  styleUrls: ['select-active.component.css'],
  directives: [ROUTER_DIRECTIVES, ToastComponent]
})
export class SelectActiveComponent implements OnInit {

  @ViewChild('toast') toast: ToastComponent;

  constructor(private transitionService: TransitionService,
              private adminService: AdminService) { }

  ngOnInit() {
    this.transitionService.transition();
  }

  changeActiveConf(conferenceTitle: string) {
    this.adminService.changeActiveConf(conferenceTitle)
        .then(res => this.toast.message('Active conference changed!'));
  }
}