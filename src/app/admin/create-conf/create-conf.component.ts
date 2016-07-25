import { Component, OnInit } from '@angular/core';

import { TransitionService } from '../../shared/transition.service';

@Component({
  moduleId: module.id,
  selector: 'create-conf',
  templateUrl: 'create-conf.component.html',
  styleUrls: ['create-conf.component.css']
})
export class CreateConfComponent implements OnInit {

  constructor(private transitionService: TransitionService) { }

  ngOnInit() {
    this.transitionService.transition();
  }

}