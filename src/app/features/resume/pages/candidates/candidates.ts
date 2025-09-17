import { Component } from '@angular/core';
import { ResumeList } from '@/app/features/resume/components/resume-list/resume-list';
import { Actions, ofType } from '@ngrx/effects';
import * as ResumeActions from '@/app/features/resume/store/resume.actions';
import { Store } from '@ngrx/store';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
	selector: 'app-candidates',
	imports: [ResumeList, TranslocoModule],
	templateUrl: './candidates.html',
})
export class Candidates {
	constructor(private store: Store) {}

	ngOnInit(): void {
		this.loadResumes();
	}

	loadResumes() {
		this.store.dispatch(ResumeActions.loadResumes());
	}
}
