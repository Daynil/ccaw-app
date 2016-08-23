import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../shared/auth.service';
import { TransitionService } from '../../shared/transition.service';
import { Speaker } from '../../shared/speaker.model';

@Component({
  moduleId: module.id,
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.css']
})
export class DashboardComponent {

  user: Speaker;

  constructor(private transitionService: TransitionService,
              private authService: AuthService,
              private router: Router) {
    authService.user.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit() {
    this.transitionService.transition();
  }

  goto(where: string) {
    switch (where) {
      case 'profile':
        this.router.navigate(['/speaker', { id: this.user._id }]);
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