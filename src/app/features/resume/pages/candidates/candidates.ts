import { Component, inject } from '@angular/core';
import { ResumeList } from '@/app/features/resume/components/resume-list/resume-list';
import { Actions, ofType } from '@ngrx/effects';
import * as ResumeActions from '@/app/features/resume/store/resume.actions';
import { Store } from '@ngrx/store';
import { TranslocoModule } from '@ngneat/transloco';
import { toSignal } from '@angular/core/rxjs-interop';
import * as ResumeSelectors from '@/app/features/resume/store/resume.selectors';
import { switchMap } from 'rxjs';

@Component({
	selector: 'app-candidates',
	imports: [ResumeList, TranslocoModule],
	templateUrl: './candidates.html',
})
export class Candidates {
  private store = inject(Store);
  private actions$ = inject(Actions);

  resumes = toSignal(
    this.actions$.pipe(
      ofType(ResumeActions.loadResumesPageSuccess),
      switchMap(() => this.store.select(ResumeSelectors.selectResumeItems))
    ),
    { initialValue: [] }
  );

  ngOnInit(): void {
    this.loadResumes();
  }

	loadResumes() {
		this.store.dispatch(ResumeActions.loadResumesPage({ page: 1, pageSize: 5 }));
	}
}
