import { Component } from '@angular/core';
import { ResumeList } from '@/app/features/resume/components/resume-list/resume-list';
import { Actions, ofType } from '@ngrx/effects';
import * as ResumeActions from '@/app/features/resume/store/resume.actions';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-resumes',
	imports: [ResumeList],
	templateUrl: './resumes.html',
})
export class Resumes {
	constructor(private actions$: Actions, private store: Store) {}

	ngOnInit(): void {
		this.loadResumes();
	}

	loadResumes() {
		this.store.dispatch(ResumeActions.loadResumes());
	}
}
