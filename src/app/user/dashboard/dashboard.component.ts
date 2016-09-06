import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';

import { AdminService } from '../../shared/admin.service';
import { AuthService } from '../../shared/auth.service';
import { TransitionService } from '../../shared/transition.service';
import { SessionService } from '../../shared/session.service';
import { Session } from '../../shared/session.model';
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
  allSpeakerSessions: Session[] = [];
  pendingSessions: Session[] = [];
  scheduledSessions: Session[] = [];
  
  addingCopres = false;

  constructor(private transitionService: TransitionService,
              private adminService: AdminService,
              private authService: AuthService,
              private router: Router,
              private sessionService: SessionService,
              private speakerService: SpeakerService) {

    this.authService.user.subscribe(user => {
      this.speaker = this.speakerService.getSpeaker(user._id);
    });

    this.sessionService.sessionsUnfiltered.subscribe(sessions => {
      this.allSpeakerSessions = this.sessionService.getSpeakerSessions(this.speaker._id);
      this.pendingSessions = _.filter(this.allSpeakerSessions, session => {
        // Approved but unscheduled sessions are considered pending for dashboard
        if (session.approval === 'approved') {
          if (session.statusTimeLocation.length === 0) return true;
        }
        if (session.approval === 'pending' || session.approval === 'denied') {
          return true;
        }
        return false;
      });
      this.scheduledSessions = _.filter(this.allSpeakerSessions, session => {
        if (session.approval === 'approved' && session.statusTimeLocation.length > 0) {
          return true;
        }
        return false;
      });
      console.log('all', this.allSpeakerSessions);
      console.log('pending', this.pendingSessions);
      console.log('scheduled', this.scheduledSessions);
    });

  }

  ngOnInit() {
    this.transitionService.transition();
  }

  getPart(session: Session, occurrence) {
    if (session.length === '90') return '';
    else return `Part ${occurrence.part}: `
  }

  getDate(occurrence) {
    return this.adminService.findDateBySlot(occurrence.timeSlot);
  }

  slot(occurrence) {
    return this.adminService.findSlotById(occurrence.timeSlot);
  }

  goto(where: string) {
    switch (where) {
      case 'profile':
        this.router.navigate(['/speaker', { id: this.speaker._id }]);
        break;
      case 'proposal':
        this.router.navigate(['/session', { leadPresId: this.speaker._id }]);
        break;
      case 'copres':
        this.router.navigate(['/speaker']);
        break;
      default:
        break;
    }
  }

}