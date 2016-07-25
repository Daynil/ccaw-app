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
  { path: 'admin',               component: HomeComponent },
  { path: 'admin/calendar',      component: CalendarComponent },
  { path: 'admin/create-conf',   component: CreateConfComponent },
  { path: 'admin/modify-conf',    component: ModifyConfComponent },
  { path: 'admin/proposal',      component: ProposalComponent },
  { path: 'admin/select-active', component: SelectActiveComponent },
  { path: 'admin/session',       component: SessionComponent },
  { path: 'admin/session-list',  component: SessionListComponent },
  { path: 'admin/speaker',       component: SpeakerComponent },
  { path: 'admin/speaker-list',  component: SpeakerListComponent }
];


export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];