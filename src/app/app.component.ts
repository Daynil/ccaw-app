import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { TransitionService } from './shared/transition.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [TransitionService]
})
export class AppComponent {
  
  constructor() { 

  }

}