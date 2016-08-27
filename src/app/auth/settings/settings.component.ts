import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, Validators } from '@angular/forms';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { TransitionService } from '../../shared/transition.service';
import { ToastComponent } from '../../shared/toast.component';

@Component({
               moduleId: module.id,
               selector: 'settings',
               templateUrl: 'settings.component.html',
               styleUrls: ['settings.component.css'],
               directives: [ToastComponent, ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES]
           })
export class SettingsComponent implements OnInit {

    @ViewChild('toast') toast: ToastComponent;
    @ViewChild('password') pass1Input: ElementRef;
    @ViewChild('password2') pass2Input: ElementRef;

    password: FormControl;
    password2: FormControl;
    form: FormGroup;

    constructor(private transitionService: TransitionService,
                private router: Router,
                private authService: AuthService) { }

    ngOnInit() {
        this.password = new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(18)]));
        this.password2 = new FormControl('', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(18)]));

        this.form = new FormGroup({
            'password': this.password,
            'password2': this.password2
        });

        this.transitionService.transition();
    }

    doChangePassword(event) {
        event.preventDefault();
        let pass = this.pass1Input.nativeElement.value;
        let pass2 = this.pass2Input.nativeElement.value;

        if (pass !== pass2) {
            this.toast.error('Passwords do not match. Try again!');
            this.form.reset();

        } else {
            this.authService.changePassword(this.form.value)
                .then(res => {
                    this.toast.success('Your password has been changed');
                    if (this.authService.user.getValue().admin) {
                        this.router.navigate(['/home']);
                    } else {
                        this.router.navigate(['/dashboard']);
                    }
                })
                .catch(err => {
                    this.toast.error('Unable to change password. Please try again later!');
                });
        }

    }


}