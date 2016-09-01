import { Component, OnInit, ViewChild } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, Validators } from '@angular/forms';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { TransitionService } from '../../shared/transition.service';
import { ToastComponent } from '../../shared/toast.component';

@Component({
               moduleId: module.id,
               selector: 'signup',
               templateUrl: 'signup.component.html',
               styleUrls: ['signup.component.css'],
               directives: [ToastComponent, ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES]
           })

export class SignupComponent implements OnInit {

    @ViewChild('toast') toast: ToastComponent;

    firstName: FormControl;
    lastName: FormControl;
    email: FormControl;
    password: FormControl;
    form: FormGroup;

    constructor(private transitionService: TransitionService,
                private router: Router,
                private authService: AuthService) { }

    ngOnInit() {
        this.firstName = new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(64)]));
        this.lastName = new FormControl('', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(64)]));
        this.email = new FormControl('', Validators.compose([Validators.required, Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]));
        this.password = new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(18)]));

        this.form = new FormGroup({
            'lastName': this.lastName,
            'firstName': this.firstName,
            'email': this.email,
            'password': this.password
        });

        this.transitionService.transition();
    }

    doSignup(event) {
        this.authService.signup(this.form.value)
            .then(res => {
                this.toast.success('You account is registered. Please login!');
                this.router.navigate(['/login']);
            })
            .catch(err => {
                if (err.status === 409) {
                    this.toast.error('This email address is already registered!');
                }
                else {
                    this.toast.error('Unable to register, please try again later');
                }
            });
        event.preventDefault();
    }
}