import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { AdminService } from './shared/admin.service';
import { TransitionService } from './shared/transition.service';

@Component({
  moduleId: module.id,
  selector: 'my-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  directives: [ROUTER_DIRECTIVES],
  providers: [AdminService, TransitionService]
})
export class AppComponent implements OnInit {
  
  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.getAllConferences();
  }

}