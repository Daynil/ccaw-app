import { Component, OnInit, ViewChild } from '@angular/core';

import { TransitionService } from '../../shared/transition.service';
import { ToastComponent } from '../../shared/toast.component';

@Component({
               moduleId: module.id,
               selector: 'signup',
               templateUrl: 'signup.component.html',
               styleUrls: ['signup.component.css'],
               directives: [ToastComponent]
           })
export class SignupComponent implements OnInit {

    @ViewChild('toast') toast: ToastComponent;

    constructor(private transitionService: TransitionService) { }

    ngOnInit() {
        this.transitionService.transition();
    }

}