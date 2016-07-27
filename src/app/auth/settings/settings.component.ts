import { Component, OnInit, ViewChild } from '@angular/core';

import { TransitionService } from '../../shared/transition.service';
import { ToastComponent } from '../../shared/toast.component';

@Component({
               moduleId: module.id,
               selector: 'settings',
               templateUrl: 'settings.component.html',
               styleUrls: ['settings.component.css'],
               directives: [ToastComponent]
           })
export class SettingsComponent implements OnInit {

    @ViewChild('toast') toast: ToastComponent;

    constructor(private transitionService: TransitionService) { }

    ngOnInit() {
        this.transitionService.transition();
    }

}