import { Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import { AuthService } from '../auth.service';
import { SpeakerService } from '../speaker.service';
import { TransitionService } from '../transition.service';
import { ToastComponent } from '../toast.component';
import { Speaker } from '../speaker.model';

@Component({
  moduleId: module.id,
  selector: 'speaker',
  templateUrl: 'speaker.component.html',
  styleUrls: ['speaker.component.css']
})
export class SpeakerComponent implements OnInit, OnDestroy {

  @ViewChild('toast') toast: ToastComponent;

  private paramsub: any;

  model: Speaker;
  leadPresId: string = null;

  costsCovered = [
    {
      name: 'travel',
      covered: false
    },
    {
      name: 'lodging',
      covered: false
    }
  ];

  constructor(private transitionService: TransitionService,
              private authService: AuthService,
              private speakerService: SpeakerService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.transitionService.transition();

    // Check for params
    this.paramsub = this.route.params.subscribe(params => {
      // Initialize fields for brand new speakers
      if (!params['id']) {
        this.model = <Speaker>{
          mediaWilling: true,
          costsCoveredByOrg: this.costsCovered,
          hasPresentedAtCCAWInPast2years: false,
        }
        this.model.address2 = '';
        this.model.assistantOrCC = '';
      } else {
        this.model = this.speakerService.getSpeaker(params['id']);
      }
      if (params['leadPresId']) {
        this.leadPresId = params['leadPresId'];
      }
    });
  }

  ngOnDestroy() {
    this.paramsub.unsubscribe();
  }

  capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  changeCostCovered(isChecked: boolean, costChecked) {
    let cost = _.find(this.model.costsCoveredByOrg, cost => cost.name === costChecked.name);
    cost.covered = isChecked;
  }

  updateSpeaker(form: NgForm) {
    if (!form.valid) return;

    if (this.leadPresId) {
      let leadPres = this.speakerService.getSpeaker(this.leadPresId);
      let signupData = {
        email: this.model.email,
        firstName: this.model.nameFirst,
        lastName: this.model.nameLast
      }
      this.authService
          .signUpForCopres(leadPres, signupData)
          .then(res => {
            // We need to sync the mongoos ID before udating remaining fields
            this.model._id = res.userId;
            this.speakerService
                .updateSpeaker(this.model)
                .then(res => {
                  this.toast.success('Copresenter account created and emailed!')
                });
          })
          .catch(err => {
            if (err.status === 409) {
              this.toast.error('A speaker with that email already exists');
            }
          });
    } else {
      this.speakerService
          .updateSpeaker(this.model)
          .then(res => this.toast.success('Speaker updated!'));
    }

  }

}