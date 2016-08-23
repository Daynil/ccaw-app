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
        if (emailTxt.length < 1 || passTxt.length < 1) return;
        this.authService.login(emailTxt, passTxt)
            .then((res: any) => {
                // TODO: fix login errors throwing improperly
/*                console.log('login res', res);
                return;
                if (res.alert === 'no user found') {
                    this.toast.error('Email or password not found');
                }
                else if (res.alert === 'wrong password') {
                    this.toast.error('Email or password entered incorrectly');
                }
                else {*/
/*                }*/
                if (this.authService.user.getValue().admin) {
                    this.router.navigate(['/home']);
                } else {
                    this.router.navigate(['/dashboard']);
                }
            })
            .catch(err => {
                console.log(err);
                if (err.alert === 'no user found') {
                    this.toast.error('Email not found');
                }
                else {
                    this.toast.error('Login error, please try again later');
                }
            });
    }

}