import { createReducer, on } from '@ngrx/store';
import * as StepFormActions from './step-form.actions';
import { StepFormState } from './step-form.model';

export const initialState: StepFormState = {
  step: 0,
  data: {
    name: '',
    birthDate: '',
    phone: '',
    cpf: '',
    address: '',
    district: '',
    city: '',
    state: '',
    zipCode: '',
    ocupation: '',
    company: '',
    salary: '',
    skills: [],
  },
  loading: false,
  error: null,
  ocupations: [],
};

export const stepFormReducer = createReducer(
  initialState,
  on(StepFormActions.nextStep, (state) => ({ ...state, step: state.step + 1 })),
  on(StepFormActions.prevStep, (state) => ({ ...state, step: Math.max(0, state.step - 1) })),
  on(StepFormActions.setStep, (state, { step }) => ({ ...state, step })),
  on(StepFormActions.setFormData, (state, { data }) => ({ ...state, data: { ...state.data, ...data } })),
  on(StepFormActions.submitForm, (state) => ({ ...state, loading: true, error: null })),
  on(StepFormActions.submitFormSuccess, (state, { id }) => ({ ...state, loading: false })),
  on(StepFormActions.submitFormFailure, (state, { error }) => ({ ...state, loading: false, error })),
  
  // CEP lookup
  on(StepFormActions.lookupCep, (state) => ({ ...state, loading: true, error: null })),
  on(StepFormActions.lookupCepSuccess, (state, { data }) => ({
    ...state,
    loading: false,
    data: { ...state.data, ...data },
  })),
  on(StepFormActions.lookupCepFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Ocupations
  on(StepFormActions.getOcupations, (state) => ({ ...state, loading: true, error: null })),
  on(StepFormActions.getOcupationsSuccess, (state, { ocupations }) => ({ ...state, loading: false, ocupations })),
  on(StepFormActions.getOcupationsFailure, (state, { error }) => ({ ...state, loading: false, error })),
);
