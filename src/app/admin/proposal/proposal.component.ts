import { Component, OnInit } from '@angular/core';

import { TransitionService } from '../../shared/transition.service';

@Component({
  moduleId: module.id,
  selector: 'proposal',
  templateUrl: 'proposal.component.html',
  styleUrls: ['proposal.component.css']
})
export class ProposalComponent implements OnInit {

  constructor(private transitionService: TransitionService) { }

  ngOnInit() {
    this.transitionService.transition();
  }
  
}