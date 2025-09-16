import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@ngneat/transloco';
import { provideStore, provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { StepFormEffects } from './features/form-registration/store/step-form.effects';
import { stepFormReducer } from './features/form-registration/store/step-form.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), provideHttpClient(), provideTransloco({
      config: {
        availableLangs: ['pt-br', 'en-us', 'es-es'],
        defaultLang: 'pt-br',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader
    }),
    provideStore(),
    provideState('stepForm', stepFormReducer),
    provideEffects([
      StepFormEffects
    ])
  ]
};
