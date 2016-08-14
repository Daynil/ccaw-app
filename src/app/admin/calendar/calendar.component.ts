import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';

import { AdminService } from '../../shared/admin.service';
import { Conference, TimeSlot } from '../../shared/conference.model';
import { Session } from '../../shared/session.model';
import { SessionService } from '../../shared/session.service';
import { TransitionService } from '../../shared/transition.service';
import { TimePipe } from '../../shared/time.pipe';
import { ToastComponent } from '../../shared/toast.component';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'calendar',
  templateUrl: 'calendar.component.html',
  styleUrls: ['calendar.component.css'],
  directives: [ToastComponent],
  pipes: [TimePipe]
})
export class CalendarComponent implements OnInit, AfterViewInit {

  @ViewChild('toast') toast: ToastComponent;
  @ViewChild('setSessionModal') setSessionModalRef: ElementRef;
  setSessionModal;

  selectedSlot: TimeSlot;
  selectedRoom: string;

  constructor(private transitionService: TransitionService,
              private adminService: AdminService,
              private sessionService: SessionService,
              private router: Router) { }

  ngOnInit() {
    this.transitionService.transition();
  }

  ngAfterViewInit() {
    // Use bootstrap's themed jQuery to avoid using alpha ang2 material
    this.setSessionModal = $(this.setSessionModalRef.nativeElement);
  }

  getSession(slot: TimeSlot, room: string) {
    // Why is slot is missing? Angular 2 change detection quirk?
    if (!slot) {
      return;
    }
    return this.sessionService.findSession(slot, room);
  }

  setSelectedSlot(slot: TimeSlot, room: string) {
    this.selectedSlot = slot;
    this.selectedRoom = room;
    this.setSessionModal.modal('show');
  }

  saveSlot(slot: TimeSlot, room: string, sessionId: string) {
    if (sessionId === 'None') {
      this.sessionService.clearSlot(slot, room)
          .then(res => {
            if (res !== 'No scheduled session') {
              this.toast.success('Session removed');
            }
          });
      return;
    }
    this.sessionService.setSession(slot, room, sessionId)
        .then(res => {
          this.toast.success('Session assigned to slot');
        });
  }

  removeSession(slot: TimeSlot, room: string) {
    this.sessionService.clearSlot(slot, room)
        .then(res => {
          this.toast.success('Session removed');
        })
  }

  gotoSession(slot, room) {
    let session = this.getSession(slot, room);
    this.router.navigate(['/session', {id: session._id}]);
  }

  // DEBUG
  get diagnostic() { return JSON.stringify(this.selectedSlot); }

}