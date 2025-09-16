import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RegistrationService } from '@/app/features/form-registration/services/registration.service';
import { CepService } from '@/app/features/form-registration/services/cep.service';
import * as StepFormActions from './step-form.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import { inject } from '@angular/core';

@Injectable()
export class StepFormEffects {
  private actions$ = inject(Actions);
  private registrationService = inject(RegistrationService);
  private cepService = inject(CepService);

  submitForm$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StepFormActions.submitForm),
      mergeMap(({ data }) =>
        this.registrationService.submitRegistration(data).pipe(
          map(() => StepFormActions.submitFormSuccess()),
          catchError((error) => of(StepFormActions.submitFormFailure({ error: error.message || 'Erro ao enviar' })))
        )
      )
    )
  );

  lookupCep$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StepFormActions.lookupCep),
      mergeMap(({ zipCode }) =>
        this.cepService.lookup(zipCode).pipe(
          mergeMap((res) => [
            StepFormActions.setFormData({ data: {
              zipCode: res.zipCode,
              address: res.address,
              district: res.district,
              city: res.city,
              state: res.state,
            }}),
            StepFormActions.lookupCepSuccess({ data: {
              zipCode: res.zipCode,
              address: res.address,
              district: res.district,
              city: res.city,
              state: res.state,
            }})
          ]),
          catchError((error) => of(StepFormActions.lookupCepFailure({ error: error.message || 'CEP não encontrado' })))
        )
      )
    )
  );
}
