import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as ResumeActions from './resume.actions';
import { ResumeService } from '../services/resume.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import { DataStepForm } from '@/app/shared/interfaces/steps.interfaces';


@Injectable()
export class ResumeEffects {
  private actions$ = inject(Actions);
  private api = inject(ResumeService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResumeActions.loadResumes),
      mergeMap(() =>
        this.api.getResumes().pipe(
          map((items) => ResumeActions.loadResumesSuccess({ items })),
          catchError((error) => of(ResumeActions.loadResumesFailure({ error })))
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
