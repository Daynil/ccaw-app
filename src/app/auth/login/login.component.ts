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
               directives: [ToastComponent, ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES]
           })
export class LoginComponent implements OnInit {

    @ViewChild('toast') toast: ToastComponent;

    email: FormControl;
    password: FormControl;
    form: FormGroup;

    constructor(private transitionService: TransitionService,
                private router: Router,
                private authService: AuthService) { }

    ngOnInit() {
        this.email = new FormControl('', Validators.compose([Validators.required, Validators.pattern("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")]));
        this.password = new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(18)]));

        this.form = new FormGroup({
            'email': this.email,
            'password': this.password
        });

        this.transitionService.transition();
    }

    doLogin(event) {
        this.authService.login(this.form.value)
            .then((res: any) => {
                    console.log('login res', res);
                    this.toast.success('Logged in!');
                    this.router.navigate(['/home']);
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
        event.preventDefault();
    }

}