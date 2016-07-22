import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { TransitionService } from '../shared/transition.service';

@Component({
  moduleId: module.id,
  selector: 'speaker-list',
  templateUrl: 'speaker-list.component.html',
  styleUrls: ['speaker-list.component.css'],
  directives: [ROUTER_DIRECTIVES]
})
export class SpeakerListComponent implements OnInit {
  
  constructor(private transitionService: TransitionService) { }

  ngOnInit() {
    this.transitionService.transition();
  }

}