import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { TransitionService } from '../../shared/transition.service';

@Component({
  moduleId: module.id,
  selector: 'select-active',
  templateUrl: 'select-active.component.html',
  styleUrls: ['select-active.component.css'],
  directives: [ROUTER_DIRECTIVES]
})
export class SelectActiveComponent implements OnInit {

  constructor(private transitionService: TransitionService) { }

  ngOnInit() {
    this.transitionService.transition();
  }
}