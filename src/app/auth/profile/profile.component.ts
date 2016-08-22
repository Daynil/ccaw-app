import { Component, OnInit, ViewChild } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';

import { TransitionService } from '../../shared/transition.service';
import { ToastComponent } from '../../shared/toast.component';

@Component({
               moduleId: module.id,
               selector: 'profile',
               templateUrl: 'profile.component.html',
               styleUrls: ['profile.component.css'],
               directives: [ToastComponent, ROUTER_DIRECTIVES]
           })
export class ProfileComponent implements OnInit {

    @ViewChild('toast') toast: ToastComponent;

    constructor(private transitionService: TransitionService,
                private router: Router) { }

    ngOnInit() {
        this.transitionService.transition();
    }

}