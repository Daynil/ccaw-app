import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { TransitionService } from '../transition.service';
import { ToastComponent } from '../toast.component';
import { Speaker, Presentation } from '../speaker.model';

@Component({
  moduleId: module.id,
  selector: 'speaker',
  templateUrl: 'speaker.component.html',
  styleUrls: ['speaker.component.css'],
  directives: [ToastComponent]
})
export class SpeakerComponent implements OnInit {

  @ViewChild('toast') toast: ToastComponent;

  model: Speaker = <Speaker>{};

  constructor(private transitionService: TransitionService) { }

  ngOnInit() {
    this.transitionService.transition();
  }

  // DEBUG
  get diagnostic() { return JSON.stringify(this.model); }

}