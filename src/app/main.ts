import { bootstrap }    from '@angular/platform-browser-dynamic';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { enableProdMode } from "@angular/core";

import { AppComponent } from './app.component';
import { APP_ROUTER_PROVIDERS } from './app.routes';

// enableProdMode();

bootstrap(AppComponent, [
  APP_ROUTER_PROVIDERS,
  disableDeprecatedForms(),
  provideForms()
])
.catch(error => console.log(error));