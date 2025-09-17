import { createAction, props } from '@ngrx/store';
import { DataStepForm, ResponsePaginated } from '@/app/shared/interfaces/steps.interfaces';

// Pagination
export const loadResumesPage = createAction(
  '[Resumes] Load Resumes Page',
  props<{ page: number; pageSize: number }>()
);
export const loadResumesPageSuccess = createAction(
  '[Resumes] Load Resumes Page Success',
  props<{ response: ResponsePaginated }>()
);
export const loadResumesPageFailure = createAction('[Resumes] Load Resumes Page Failure', props<{ error: unknown }>());

export const deleteResume = createAction('[Resumes] Delete Resume', props<{ id: string }>());
export const deleteResumeSuccess = createAction('[Resumes] Delete Resume Success', props<{ id: string }>());
export const deleteResumeFailure = createAction('[Resumes] Delete Resume Failure', props<{ error: unknown }>());

export const getCandidateResume = createAction('[Resumes] Get Candidate Resume', props<{ id: string }>());
export const getCandidateResumeSuccess = createAction('[Resumes] Get Candidate Resume Success', props<{ item: DataStepForm }>());
export const getCandidateResumeFailure = createAction('[Resumes] Get Candidate Resume Failure', props<{ error: unknown }>());
