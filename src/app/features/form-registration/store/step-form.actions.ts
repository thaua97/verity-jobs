import { createAction, props } from '@ngrx/store';
import { DataStepForm, Ocupations } from '@/app/shared/interfaces/steps.interfaces';

export const nextStep = createAction('[Step Form] Next Step');
export const prevStep = createAction('[Step Form] Previous Step');
export const setStep = createAction('[Step Form] Set Step', props<{ step: number }>());

export const setFormData = createAction('[Step Form] Set Data', props<{ data: Partial<DataStepForm> }>());

export const submitForm = createAction('[Step Form] Submit', props<{ data: DataStepForm }>());
export const submitFormSuccess = createAction('[Step Form] Submit Success', props<{ id: string }>());
export const submitFormFailure = createAction('[Step Form] Submit Failure', props<{ error: string }>());

// CEP Lookup
export const lookupCep = createAction('[Step Form] Lookup CEP', props<{ zipCode: string }>());
export const lookupCepSuccess = createAction(
  '[Step Form] Lookup CEP Success',
  props<{ data: { zipCode: string; address: string; district: string; city: string; state: string } }>()
);
export const lookupCepFailure = createAction('[Step Form] Lookup CEP Failure', props<{ error: string }>());


export const getOcupations = createAction('[Step Form] Get Ocupations');
export const getOcupationsSuccess = createAction('[Step Form] Get Ocupations Success', props<{ ocupations: Ocupations[] }>());
export const getOcupationsFailure = createAction('[Step Form] Get Ocupations Failure', props<{ error: string }>());
