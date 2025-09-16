import { createAction, props } from '@ngrx/store';
import { DataStepForm } from '@/app/shared/interfaces/steps.interfaces';

export const nextStep = createAction('[Step Form] Next Step');
export const prevStep = createAction('[Step Form] Previous Step');
export const setStep = createAction('[Step Form] Set Step', props<{ step: number }>());
// Each step provides only a slice of the complete form, so accept Partial
export const setFormData = createAction('[Step Form] Set Data', props<{ data: Partial<DataStepForm> }>());

export const submitForm = createAction('[Step Form] Submit', props<{ data: DataStepForm }>());
export const submitFormSuccess = createAction('[Step Form] Submit Success');
export const submitFormFailure = createAction('[Step Form] Submit Failure', props<{ error: string }>());

// CEP Lookup
export const lookupCep = createAction('[Step Form] Lookup CEP', props<{ zipCode: string }>());
export const lookupCepSuccess = createAction(
  '[Step Form] Lookup CEP Success',
  props<{ data: { zipCode: string; address: string; district: string; city: string; state: string } }>()
);
export const lookupCepFailure = createAction('[Step Form] Lookup CEP Failure', props<{ error: string }>());
