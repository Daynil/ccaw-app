import { provideRouter, RouterConfig } from '@angular/router';

import { HomeComponent } from './admin/home/home.component';
import { CalendarComponent } from './admin/calendar/calendar.component';
import { CreateConfComponent } from './admin/create-conf/create-conf.component';
import { ModifyConfComponent } from './admin/modify-conf/modify-conf.component';
import { ProposalComponent } from './admin/proposal/proposal.component';
import { SelectActiveComponent } from './admin/select-active/select-active.component';
import { SessionComponent } from './shared/session/session.component';
import { SessionListComponent } from './admin/session-list/session-list.component';
import { SpeakerComponent } from './shared/speaker/speaker.component';
import { SpeakerListComponent } from './admin/speaker-list/speaker-list.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SettingsComponent } from './auth/settings/settings.component';

export const routes: RouterConfig = [
  { path: '',              component: HomeComponent },
  { path: 'calendar',      component: CalendarComponent },
  { path: 'create-conf',   component: CreateConfComponent },
  { path: 'modify-conf',   component: ModifyConfComponent },
  { path: 'proposal',      component: ProposalComponent },
  { path: 'select-active', component: SelectActiveComponent },
  { path: 'session',       component: SessionComponent },
  { path: 'session-list',  component: SessionListComponent },
  { path: 'speaker',   component: SpeakerComponent },
  { path: 'speaker-list',  component: SpeakerListComponent },
  { path: 'login',         component: LoginComponent },
  { path: 'signup',        component: SignupComponent },
  { path: 'settings',      component: SettingsComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];