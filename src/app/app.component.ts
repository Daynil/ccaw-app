import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';

import { AdminService } from './shared/admin.service';
import { AuthService } from './shared/auth.service';
import { DateService } from './shared/date.service';
import { SessionService } from './shared/session.service';
import { SpeakerService } from './shared/speaker.service';
import { TransitionService } from './shared/transition.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [HTTP_PROVIDERS, AdminService, AuthService, DateService, SessionService, 
              SpeakerService, TransitionService]
})
export class AppComponent implements OnInit {
  
  constructor(private adminService: AdminService,
              private sessionService: SessionService,
              private speakerService: SpeakerService,
              private authService: AuthService) { }

  ngOnInit() {
    this.adminService.getAllConferences();
    this.sessionService.getAllSessions();
    this.speakerService.getAllSpeakers();
  }

}