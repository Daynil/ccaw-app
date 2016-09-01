import { NgModule } from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routing } from './app.routing';

/** Route authorization guards */
import { AdminGuard } from './shared/admin-guard.service';
import { SpeakerGuard } from './shared/speaker-guard.service';

/** Root component */
import { AppComponent }   from './app.component';

/** Components */
import { HomeComponent } from './admin/home/home.component';
import { CalendarComponent } from './admin/calendar/calendar.component';
import { CreateConfComponent } from './admin/create-conf/create-conf.component';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { ModifyConfComponent } from './admin/modify-conf/modify-conf.component';
import { SelectActiveComponent } from './admin/select-active/select-active.component';
import { SessionComponent } from './shared/session/session.component';
import { SessionListComponent } from './admin/session-list/session-list.component';
import { SpeakerComponent } from './shared/speaker/speaker.component';
import { SpeakerListComponent } from './admin/speaker-list/speaker-list.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SettingsComponent } from './auth/settings/settings.component';
import { LandingComponent } from './auth/landing/landing.component';
import { AdministrationComponent } from './admin/administration/administration.component';
import { ForgotPasswordComponent } from './auth/forgotpassword/forgotpassword.component';

/** App-wide Services */
import { AdminService } from './shared/admin.service';
import { AuthService } from './shared/auth.service';
import { DateService } from './shared/date.service';
import { SessionService } from './shared/session.service';
import { SpeakerService } from './shared/speaker.service';
import { TransitionService } from './shared/transition.service';

/** Pipes */
import { DatePipe } from './shared/date.pipe';
import { CapitalizePipe } from './shared/capitalize.pipe';
import { TimePipe } from './shared/time.pipe';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  declarations: [
    // Components
    AppComponent, HomeComponent, CalendarComponent, CreateConfComponent,
    DashboardComponent, ModifyConfComponent, SelectActiveComponent, SessionComponent,
    SessionListComponent, SpeakerComponent, SpeakerListComponent, LoginComponent,
    SignupComponent, SettingsComponent, LandingComponent, AdministrationComponent, 
    ForgotPasswordComponent,

    // Pipes
    DatePipe, CapitalizePipe, TimePipe
  ],
  providers: [
    // Route guards
    AdminGuard, SpeakerGuard,
    // Services
    AdminService, AuthService, DateService,
    SessionService, SpeakerService, TransitionService
  ],
  bootstrap: [AppComponent],
})

export class AppModule { }
