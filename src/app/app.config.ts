import { ApplicationConfig, InjectionToken, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor'; // Corrected import path
import { environment } from '../assets/environments/environment';
import { provideEnvConfig } from './providers/environment';
import { withBaseUrl } from './interceptors/base-url';
import { WINDOW, windowProvider } from './providers/window';

export const appConfig: ApplicationConfig = {
  providers: [
    provideEnvConfig({ apiUrl: environment.apiUrl }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([withBaseUrl, authInterceptor])),
    { provide: WINDOW, useFactory: (document: Document) => windowProvider(document), deps: [Document] },
    providePrimeNG({
      theme:
      {
        preset: Aura,
        options: {
          prefix: 'p',
          darkModeSelector: 'system',
          cssLayer: false
        }
      }
    })

  ]
};
