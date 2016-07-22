import { provideRouter, RouterConfig } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ProposalComponent } from './proposal/proposal.component';
import { SessionComponent } from './session/session.component';
import { SessionListComponent } from './session-list/session-list.component';
import { SpeakerComponent } from './speaker/speaker.component';
import { SpeakerListComponent } from './speaker-list/speaker-list.component';

export const routes: RouterConfig = [
  { path: '',              component: HomeComponent },
  { path: 'calendar',      component: CalendarComponent },
  { path: 'proposal',      component: ProposalComponent },
  { path: 'session',       component: SessionComponent },
  { path: 'session-list',  component: SessionListComponent },
  { path: 'speaker',       component: SpeakerComponent },
  { path: 'speaker-list',  component: SpeakerListComponent }
];


export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];