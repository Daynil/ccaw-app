import { Component, OnInit, ViewChild } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, Validators } from '@angular/forms';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';

import { AuthService } from '../../shared/auth.service';
import { TransitionService } from '../../shared/transition.service';
import { ToastComponent } from '../../shared/toast.component';

@Component({
               moduleId: module.id,
               selector: 'login',
               templateUrl: 'login.component.html',
               styleUrls: ['login.component.css'],
               directives: [ToastComponent, ROUTER_DIRECTIVES]
           })
export class LoginComponent implements OnInit {

    @ViewChild('toast') toast: ToastComponent;

    constructor(private transitionService: TransitionService,
                private router: Router,
                private authService: AuthService) { }

    ngOnInit() {
        this.transitionService.transition();
    }

    doLogin(email: HTMLInputElement, password: HTMLInputElement) {
        let emailTxt = email.value;
        let passTxt = password.value;
        console.log(emailTxt, passTxt);
        if (emailTxt.length < 1 || passTxt.length < 1) return;
        this.authService.login(emailTxt, passTxt)
            .then(res => {
                this.toast.success('Logged in!');
            });
    }

}