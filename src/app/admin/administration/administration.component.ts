import { Component, OnInit, ViewChild } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';

import { TransitionService } from '../../shared/transition.service';
import { ToastComponent } from '../../shared/toast.component';

@Component({
               moduleId: module.id,
               selector: 'administration',
               templateUrl: 'administration.component.html',
               styleUrls: ['administration.component.css'],
               directives: [ToastComponent, ROUTER_DIRECTIVES]
           })

export class AdministrationComponent implements OnInit {

    @ViewChild('toast') toast: ToastComponent;

    constructor(private transitionService: TransitionService,
                private router: Router) { }

    ngOnInit() {
        this.transitionService.transition();
    }

    addAdmin() {
        this.router.navigate(['/signup']);
    }

    deleteAdmin() {
        this.router.navigate(['/login']);
    }

}