import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ResumeActions from './resume.actions';
import { ResumeService } from '../services/resume.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import { ResponsePaginated } from '@/app/shared/interfaces/steps.interfaces';


@Injectable()
export class ResumeEffects {
  private actions$ = inject(Actions);
  private api = inject(ResumeService);

  loadPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResumeActions.loadResumesPage),
      mergeMap(({ page, pageSize }) =>
        this.api.getResumes(page, pageSize).pipe(
          map((resp) => {
            const response: ResponsePaginated = Array.isArray(resp)
              ? {
                  data: resp,
                  first: 1,
                  prev: null,
                  next: null,
                  last: 1,
                  pages: 1,
                  items: resp.length,
                }
              : (resp as ResponsePaginated);
            return ResumeActions.loadResumesPageSuccess({ response });
          }),
          catchError((error) => of(ResumeActions.loadResumesPageFailure({ error })))
        )
      )
    )
  );

	delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResumeActions.deleteResume),
      mergeMap(({ id }) =>
        this.api.deleteResume(id).pipe(
          map(() => ResumeActions.deleteResumeSuccess({ id })),
          catchError((error) => of(ResumeActions.deleteResumeFailure({ error })))
        )
      )
    )
  );

	getCandidate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResumeActions.getCandidateResume),
      mergeMap(({ id }) =>
        this.api.getCandidateResume(id).pipe(
          map((item) => ResumeActions.getCandidateResumeSuccess({ item })),
          catchError((error) => of(ResumeActions.getCandidateResumeFailure({ error })))
        )
      )
    )
  );
}
