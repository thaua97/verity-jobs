import { Component, OnInit, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { ResumeListItem } from '@/app/features/resume/components/resume-list-item/resume-list-item';
import { toSignal } from '@angular/core/rxjs-interop';
import * as ResumeSelectors from '@/app/features/resume/store/resume.selectors';
import * as ResumeActions from '@/app/features/resume/store/resume.actions';
import { RouterLink } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { combineLatest } from 'rxjs';

function resumeListPaginatorIntlFactory(transloco: TranslocoService): MatPaginatorIntl {
	const intl = new MatPaginatorIntl();

	combineLatest([
		transloco.selectTranslate('resumes.pagination.perPage'),
		transloco.selectTranslate('resumes.pagination.next'),
		transloco.selectTranslate('resumes.pagination.prev'),
		transloco.selectTranslate('resumes.pagination.first'),
		transloco.selectTranslate('resumes.pagination.last'),
		transloco.selectTranslate('resumes.pagination.empty'),
	]).subscribe(([perPage, next, prev, first, last, empty]) => {
		intl.itemsPerPageLabel = perPage || 'Items per page';
		intl.nextPageLabel = next || 'Next';
		intl.previousPageLabel = prev || 'Previous';
		intl.firstPageLabel = first || 'First';
		intl.lastPageLabel = last || 'Last';

		intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
			if (length === 0 || pageSize === 0) {
				return empty || 'No items';
			}
			const startIndex = page * pageSize;
			const endIndex = Math.min(startIndex + pageSize, length);
			return `${startIndex + 1} – ${endIndex} / ${length}`;
		};

		intl.changes.next();
	});

	return intl;
}

@Component({
	selector: 'app-resume-list',
	standalone: true,
	imports: [MatListModule, ResumeListItem, RouterLink, TranslocoModule, MatPaginatorModule],
	providers: [
		{
			provide: MatPaginatorIntl,
			useFactory: resumeListPaginatorIntlFactory,
			deps: [TranslocoService],
		},
	],
	templateUrl: './resume-list.html',
})
export class ResumeList implements OnInit {
	private store = inject(Store);
	resumes = toSignal(this.store.select(ResumeSelectors.selectResumeItems), { initialValue: [] });
	total = toSignal(this.store.select(ResumeSelectors.selectResumeTotal), { initialValue: 0 });
	page = toSignal(this.store.select(ResumeSelectors.selectResumePage), { initialValue: 1 });
	pageSize = toSignal(this.store.select(ResumeSelectors.selectResumePageSize), { initialValue: 5 });

	ngOnInit(): void {
		// Initial load: page 1 with 5 items per page
		this.store.dispatch(ResumeActions.loadResumesPage({ page: 1, pageSize: 5 }));
	}

	deleteResume(id: string) {
		this.store.dispatch(ResumeActions.deleteResume({ id }));
	}

	handlePage(event: PageEvent) {
		// MatPaginator is 0-based; API expects 1-based
		const nextPage = event.pageIndex + 1;
		const nextSize = event.pageSize;
		this.store.dispatch(ResumeActions.loadResumesPage({ page: nextPage, pageSize: nextSize }));
	}
}
