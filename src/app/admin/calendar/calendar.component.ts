import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { AdminService } from '../../shared/admin.service';
import { Conference, TimeSlot } from '../../shared/conference.model';
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
              private sessionService: SessionService) { }

  ngOnInit() {
    this.transitionService.transition();
  }

  ngAfterViewInit() {
    // Use bootstrap's themed jQuery to avoid using alpha ang2 material
    this.setSessionModal = $(this.setSessionModalRef.nativeElement);
  }

  getSession(slot: TimeSlot, room: string) {
    return this.sessionService.findSession(slot, room);
  }

  setSelectedSlot(slot: TimeSlot, room: string) {
    this.selectedSlot = slot;
    this.selectedRoom = room;
    this.setSessionModal.modal('show');
  }

  setSession(slot: TimeSlot, room: string, session) {

  }

}