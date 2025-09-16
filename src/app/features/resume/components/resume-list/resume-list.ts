import { Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { ResumeListItem } from '@/app/features/resume/components/resume-list-item/resume-list-item';
import { toSignal } from '@angular/core/rxjs-interop';
import * as ResumeSelectors from '@/app/features/resume/store/resume.selectors';
import * as ResumeActions from '@/app/features/resume/store/resume.actions';

@Component({
	selector: 'app-resume-list',
	standalone: true,
	imports: [MatListModule, ResumeListItem],
	templateUrl: './resume-list.html',
})
export class ResumeList {
	private store = inject(Store);
	resumes = toSignal(this.store.select(ResumeSelectors.selectResumeItems), { initialValue: [] });

	deleteResume(id: string) {
		this.store.dispatch(ResumeActions.deleteResume({ id }));
	}
}
