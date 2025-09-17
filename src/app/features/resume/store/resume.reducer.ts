import { createReducer, on } from '@ngrx/store';
import * as ResumeActions from './resume.actions';
import { DataStepForm } from '@/app/shared/interfaces/steps.interfaces';

export const RESUME_FEATURE_KEY = 'resumeList';

export interface State {
	candidate: DataStepForm;
  resumes: 	DataStepForm[];
  loading: boolean;
  error?: unknown;
  total: number;
  page: number;
  pageSize: number;
}

const initialState: State = {
	candidate: {} as DataStepForm,
  resumes: [],
  loading: false,
  error: undefined,
  total: 0,
  page: 1,
  pageSize: 5,
};

export const resumeReducer = createReducer(
  initialState,
  // Pagination
  on(ResumeActions.loadResumesPage, (state, { page, pageSize }) => ({ ...state, loading: true, error: undefined, page, pageSize })),
  on(ResumeActions.loadResumesPageSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    resumes: response.data,
    total: response.items,
    // keep page and pageSize from the previous action
  })),
  on(ResumeActions.loadResumesPageFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(ResumeActions.deleteResume, (state) => ({ ...state, loading: true, error: undefined })),
  on(ResumeActions.deleteResumeSuccess, (state, { id }) => ({ ...state, loading: false, resumes: state.resumes.filter((resume) => resume.id !== id) })),
  on(ResumeActions.deleteResumeFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(ResumeActions.getCandidateResume, (state) => ({ ...state, loading: true, error: undefined })),
  on(ResumeActions.getCandidateResumeSuccess, (state, { item }) => ({ ...state, loading: false, candidate: item })),
  on(ResumeActions.getCandidateResumeFailure, (state, { error }) => ({ ...state, loading: false, error })),
);

