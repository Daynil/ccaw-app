import { provideRouter, RouterConfig } from '@angular/router';

import { HomeComponent } from './admin/home/home.component';
import { CalendarComponent } from './admin/calendar/calendar.component';
import { CreateConfComponent } from './admin/create-conf/create-conf.component';
import { ModifyConfComponent } from './admin/modify-conf/modify-conf.component';
import { ProposalComponent } from './admin/proposal/proposal.component';
import { SelectActiveComponent } from './admin/select-active/select-active.component';
import { SessionComponent } from './admin/session/session.component';
import { SessionListComponent } from './admin/session-list/session-list.component';
import { SpeakerComponent } from './admin/speaker/speaker.component';
import { SpeakerListComponent } from './admin/speaker-list/speaker-list.component';

export const routes: RouterConfig = [
  { path: '',               component: HomeComponent },
  { path: 'calendar',      component: CalendarComponent },
  { path: 'create-conf',   component: CreateConfComponent },
  { path: 'modify-conf',   component: ModifyConfComponent },
  { path: 'proposal',      component: ProposalComponent },
  { path: 'select-active', component: SelectActiveComponent },
  { path: 'session',       component: SessionComponent },
  { path: 'session-list',  component: SessionListComponent },
  { path: 'speaker',       component: SpeakerComponent },
  { path: 'speaker-list',  component: SpeakerListComponent }
];


export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];