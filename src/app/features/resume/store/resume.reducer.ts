import { createReducer, on } from '@ngrx/store';
import * as ResumeActions from './resume.actions';
import { DataStepForm } from '@/app/shared/interfaces/steps.interfaces';

export const RESUME_FEATURE_KEY = 'resumeList';

export interface State {
	candidate: DataStepForm;
  resumes: 	DataStepForm[];
  loading: boolean;
  error?: unknown;
}

const initialState: State = {
	candidate: {} as DataStepForm,
  resumes: [],
  loading: false,
  error: undefined,
};

export const resumeReducer = createReducer(
  initialState,
  on(ResumeActions.loadResumes, (state) => ({ ...state, loading: true, error: undefined })),
  on(ResumeActions.loadResumesSuccess, (state, { items }) => ({ ...state, loading: false, resumes: items })),
  on(ResumeActions.loadResumesFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(ResumeActions.deleteResume, (state) => ({ ...state, loading: true, error: undefined })),
  on(ResumeActions.deleteResumeSuccess, (state, { id }) => ({ ...state, loading: false, resumes: state.resumes.filter((resume) => resume.id !== id) })),
  on(ResumeActions.deleteResumeFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(ResumeActions.getCandidateResume, (state) => ({ ...state, loading: true, error: undefined })),
  on(ResumeActions.getCandidateResumeSuccess, (state, { item }) => ({ ...state, loading: false, candidate: item })),
  on(ResumeActions.getCandidateResumeFailure, (state, { error }) => ({ ...state, loading: false, error })),
);

