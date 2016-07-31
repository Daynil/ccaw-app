import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { SpeakerService } from '../speaker.service';
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
  @Input('existingSpeaker') existingSpeaker;

  model: Speaker;

  costsCovered = [ 'travel', 'lodging', 'none' ];

  constructor(private transitionService: TransitionService,
              private speakerService: SpeakerService) { }

  ngOnInit() {
    this.transitionService.transition();
    if (this.existingSpeaker) this.model = this.existingSpeaker;
    else {
      this.model = <Speaker>{
        mediaWilling: true,
        costsCoveredByOrg: [],
        hasPresentedAtCCAWInPast2years: false,
      }
      this.model.address2 = '';
      this.model.assistantOrCC = '';
    }
  }

  capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  changeCostCovered(isChecked: boolean, cost: string) {
    if (isChecked) this.model.costsCoveredByOrg.push(cost);
    else this.model.costsCoveredByOrg.splice(this.model.costsCoveredByOrg.indexOf(cost), 1);
  }

  updateSpeaker(form: NgForm) {
    if (!form.valid) return;
    this.speakerService.updateSpeaker(this.model);
  }

  // DEBUG
  get diagnostic() { return JSON.stringify(this.model); }

}