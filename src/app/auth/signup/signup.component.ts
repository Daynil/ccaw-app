import { Component, OnInit, ViewChild } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, Validators } from '@angular/forms';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { TransitionService } from '../../shared/transition.service';
import { ToastComponent } from '../../shared/toast.component';
import { Http } from '@angular/http';
import { Headers } from '@angular/http';

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

    submitted: boolean = false;
    errorDiagnostic: string;

    constructor(private transitionService: TransitionService,
                private router: Router,
                private http: Http) { }

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
        console.log('form data',this.form.value);
        const contentHeaders = new Headers();
        contentHeaders.append('Accept', 'application/json');
        contentHeaders.append('Content-Type', 'application/json');

        let body = JSON.stringify(this.form.value);
        this.http.post('/signup', body, { headers: contentHeaders })
            .subscribe(
                response => {
                    console.log('response', response);
                    if (response._body.alert === 'error') {
                        this.toast.message('This email address is already registered!');
                        // this.router.navigate(['/']);
                    } else {
                        this.toast.message('You account is registered. Please login!');
                        this.router.navigate(['/login']);
                    }

                },
                error => {
                    alert(error.text());
                    console.log(error.text());
                }
            );
        event.preventDefault();
    }
}