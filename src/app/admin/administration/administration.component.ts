import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { SpeakerService } from '../../shared/speaker.service';
import { TransitionService } from '../../shared/transition.service';
import { ToastComponent } from '../../shared/toast.component';

@Component({
               moduleId: module.id,
               selector: 'administration',
               templateUrl: 'administration.component.html',
               styleUrls: ['administration.component.css']
           })

export class AdministrationComponent implements OnInit {

    @ViewChild('toast') toast: ToastComponent;
    addFlag = false;
    deleteFlag = false;

    constructor(private transitionService: TransitionService,
                private speakerService: SpeakerService,
                private router: Router) { }

    ngOnInit() {
        this.transitionService.transition();
    }

    showAddAdmin() {
        this.addFlag = true;
        this.deleteFlag = false;
    }

    showDeleteAdmin() {
        this.addFlag = false;
        this.deleteFlag = true;
    }

    addAdmin(speakerId: string) {
        this.router.navigate(['/speaker', {id: speakerId}]);
    }

}