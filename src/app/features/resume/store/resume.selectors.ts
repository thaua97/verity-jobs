import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RESUME_FEATURE_KEY, State } from './resume.reducer';

export const selectResumeState = createFeatureSelector<State>(RESUME_FEATURE_KEY);

export const selectResumeItems = createSelector(selectResumeState,
	(state) => state.resumes);
export const selectResumeLoading = createSelector(selectResumeState,
	(state) => state.loading);
export const selectResumeError = createSelector(selectResumeState,
	(state) => state.error);

export const selectCandidate = createSelector(selectResumeState,
	(state) => state.candidate);
