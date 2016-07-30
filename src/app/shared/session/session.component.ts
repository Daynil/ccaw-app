import { Component, OnInit } from '@angular/core';

import { TransitionService } from '../../shared/transition.service';

@Component({
  moduleId: module.id,
  selector: 'session',
  templateUrl: 'session.component.html',
  styleUrls: ['session.component.css']
})
export class SessionComponent implements OnInit {
 
  constructor(private transitionService: TransitionService) { }

  ngOnInit() {
    this.transitionService.transition();
  }
}