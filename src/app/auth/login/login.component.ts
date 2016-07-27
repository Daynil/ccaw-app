import { Component, OnInit, ViewChild } from '@angular/core';

import { TransitionService } from '../../shared/transition.service';
import { ToastComponent } from '../../shared/toast.component';

@Component({
               moduleId: module.id,
               selector: 'login',
               templateUrl: 'login.component.html',
               styleUrls: ['login.component.css'],
               directives: [ToastComponent]
           })
export class LoginComponent implements OnInit {

    @ViewChild('toast') toast: ToastComponent;

    constructor(private transitionService: TransitionService) { }

    ngOnInit() {
        this.transitionService.transition();
    }

}