// Polyfill for SockJS global variable - must be first
(window as any).global = window;
(window as any).process = { env: {} };

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule, RouterModule.forRoot([]))
  ]
}).catch(err => console.error(err));
