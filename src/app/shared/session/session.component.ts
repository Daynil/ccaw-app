import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import { tags } from '../tags.data';
import { TransitionService } from '../transition.service';
import { ToastComponent } from '../toast.component';
import { Speaker, Presentation } from '../speaker.model';

@Component({
  moduleId: module.id,
  selector: 'session',
  templateUrl: 'session.component.html',
  styleUrls: ['session.component.css'],
  directives: [ToastComponent]
})
export class SessionComponent implements OnInit, OnDestroy {

  @ViewChild('toast') toast: ToastComponent;

  private paramsub: any;

  model: Presentation;

  tags = tags;
  
  presentationTypeLabel = `
    Please note that case studies MUST be presented by at least two parties involved in the case, one of which must be the investigator and/or prosecutor. Additional co-presenters are welcome.

    Examples of Acceptable Co-Presenters:
    - Prosecutor + investigator
    - Prosecutor + advocate
    - Prosecutor + survivor
    - Investigator + advocate
    - Investigator + survivor

    There are no restrictions on acceptable presenters for workshops.
  `;


  constructor(private transitionService: TransitionService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.transitionService.transition();

    // Check for params
    this.paramsub = this.route.params.subscribe(params => {
      if (_.isEmpty(params)) {
        // Initialize default values for fields that need it
        this.model = <Presentation>{
          type: 'casestudy',
          length: '90',
          tags: this.tags,
          level: 'beginner',
          willingToBeRecorded: 'audio',
          isMediaOrPressFriendly: 'yes',
          willingToRepeat: true
        }
      } else {
        
      }
    });
  }

  ngOnDestroy() {
    this.paramsub.unsubscribe();
  }

  capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

 changeTag(isChecked: boolean, tagChecked) {
   let tag = _.find(this.model.tags, tag => tag.name === tagChecked.name);
   tag.checked = isChecked;
 }

  // DEBUG
  get diagnostic() { return JSON.stringify(this.model); }

}