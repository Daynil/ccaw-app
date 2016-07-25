import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { TransitionService } from '../../shared/transition.service';

@Component({
  moduleId: module.id,
  selector: 'session-list',
  templateUrl: 'session-list.component.html',
  styleUrls: ['session-list.component.css'],
  directives: [ROUTER_DIRECTIVES]
})
export class SessionListComponent implements OnInit {

  constructor(private transitionService: TransitionService) { }

  ngOnInit() {
    this.transitionService.transition();
  }

}