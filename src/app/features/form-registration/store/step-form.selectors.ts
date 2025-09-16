import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StepFormState } from './step-form.model';

export const selectStepFormState = createFeatureSelector<StepFormState>('stepForm');

export const selectCurrentStep = createSelector(
  selectStepFormState,
  (state) => state.step
);

export const selectFormData = createSelector(
  selectStepFormState,
  (state) => state.data
);

export const selectLoading = createSelector(
  selectStepFormState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectStepFormState,
  (state) => state.error
);

export const selectOcupations = createSelector(
  selectStepFormState,
  (state) => state.ocupations
);
