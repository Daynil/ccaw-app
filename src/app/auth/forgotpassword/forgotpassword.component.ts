import { Component, OnInit, ViewChild } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, Validators } from '@angular/forms';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { TransitionService } from '../../shared/transition.service';
import { ToastComponent } from '../../shared/toast.component';

@Component({
               moduleId: module.id,
               selector: 'forgotpassword',
               templateUrl: 'forgotpassword.component.html',
               styleUrls: ['forgotpassword.component.css'],
               directives: [ToastComponent, ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES]
           })
export class ForgotPasswordComponent implements OnInit {

    @ViewChild('toast') toast: ToastComponent;

    email: FormControl;
    form: FormGroup;

    constructor(private transitionService: TransitionService,
                private router: Router,
                private authService: AuthService) { }

    ngOnInit() {
        this.email = new FormControl('', Validators.compose([Validators.required, Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]));

        this.form = new FormGroup({
            'email': this.email
        });

        this.transitionService.transition();
    }

    doForgotPassword(event) {
        this.authService.forgotPassword(this.form.value)
            .then((res: any) => {
                this.toast.success('An email with your new password has been sent to your email address.');
                this.router.navigate(['/login']);
            })
            .catch(err => {
                console.log(err);
                if (err.alert === 'no user found') {
                    this.toast.error('Email not found');
                }
                else {
                    this.toast.error('Reset password error, please try again later');
                }
            });
        event.preventDefault();
    }

}