import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RESUME_FEATURE_KEY, State } from './resume.reducer';

export const selectResumeState = createFeatureSelector<State>(RESUME_FEATURE_KEY);

export const selectResumeItems = createSelector(
  selectResumeState,
  (state) => state?.resumes ?? []
);
export const selectResumeLoading = createSelector(
  selectResumeState,
  (state) => state?.loading ?? false
);
export const selectResumeError = createSelector(
  selectResumeState,
  (state) => state?.error
);

// Pagination selectors
export const selectResumeTotal = createSelector(selectResumeState, (state) => state?.total ?? 0);
export const selectResumePage = createSelector(selectResumeState, (state) => state?.page ?? 1);
export const selectResumePageSize = createSelector(selectResumeState, (state) => state?.pageSize ?? 5);

export const selectCandidate = createSelector(
  selectResumeState,
  (state) => state?.candidate
);
