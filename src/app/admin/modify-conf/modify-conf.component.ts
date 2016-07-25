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

}