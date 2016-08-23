import { bootstrap }    from '@angular/platform-browser-dynamic';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { enableProdMode } from "@angular/core";
import { HTTP_PROVIDERS } from '@angular/http';

import { AppComponent } from './app.component';
import { APP_ROUTER_PROVIDERS } from './app.routes';
import { AdminGuard } from './shared/admin-guard.service';
import { AuthService } from './shared/auth.service';
import { SpeakerGuard } from './shared/speaker-guard.service';

// enableProdMode();

bootstrap(AppComponent, [
  APP_ROUTER_PROVIDERS,
  AdminGuard,
  AuthService,
  disableDeprecatedForms(),
  provideForms(),
  HTTP_PROVIDERS,
  SpeakerGuard
])
.catch(error => console.log(error));