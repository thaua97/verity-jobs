import { createAction, props } from '@ngrx/store';
import { DataStepForm } from '@/app/shared/interfaces/steps.interfaces';

export const loadResumes = createAction('[Resumes] Load Resumes');
export const loadResumesSuccess = createAction('[Resumes] Load Resumes Success', props<{ items: DataStepForm[] }>());
export const loadResumesFailure = createAction('[Resumes] Load Resumes Failure', props<{ error: unknown }>());

export const deleteResume = createAction('[Resumes] Delete Resume', props<{ id: string }>());
export const deleteResumeSuccess = createAction('[Resumes] Delete Resume Success', props<{ id: string }>());
export const deleteResumeFailure = createAction('[Resumes] Delete Resume Failure', props<{ error: unknown }>());

export const getCandidateResume = createAction('[Resumes] Get Candidate Resume', props<{ id: string }>());
export const getCandidateResumeSuccess = createAction('[Resumes] Get Candidate Resume Success', props<{ item: DataStepForm }>());
export const getCandidateResumeFailure = createAction('[Resumes] Get Candidate Resume Failure', props<{ error: unknown }>());
