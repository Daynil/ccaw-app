import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../shared/auth.service';
import { TransitionService } from '../../shared/transition.service';
import { Speaker } from '../../shared/speaker.model';
import { SpeakerService } from '../../shared/speaker.service';

@Component({
  moduleId: module.id,
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})
export class DashboardComponent {

  speaker: Speaker;

  constructor(private transitionService: TransitionService,
              private authService: AuthService,
              private router: Router,
              private speakerService: SpeakerService) {
    this.authService.user.subscribe(user => {
      this.speaker = this.speakerService.getSpeaker(user._id);
    });
  }

  ngOnInit() {
    this.transitionService.transition();

  }

  goto(where: string) {
    switch (where) {
      case 'profile':
        this.router.navigate(['/speaker', { id: this.speaker._id }]);
        break;
      case 'proposal':
        this.router.navigate(['/session']);
        break;
      case 'copres':
        this.router.navigate(['/speaker']);
        break;
      default:
        break;
    }
  }

}