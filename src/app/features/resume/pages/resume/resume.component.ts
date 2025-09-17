import { Component, ElementRef, Signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { DataStepForm } from '@/app/shared/interfaces/steps.interfaces';
import { PdfExportService } from '@/app/shared/services/pdf-export.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import * as ResumeActions from '@/app/features/resume/store/resume.actions';
import * as ResumeSelectors from '@/app/features/resume/store/resume.selectors';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
	selector: 'app-resume',
	standalone: true,
	imports: [
		CommonModule,
		MatCardModule,
		MatListModule,
		MatIconModule,
		MatButtonModule,
		TranslocoModule,
		RouterLink
	],
	templateUrl: './resume.component.html',
})
export class ResumeComponent {
	formData: Signal<DataStepForm | undefined>;
	@ViewChild('resumeRef') resumeRef?: ElementRef<HTMLElement>;

	constructor(private store: Store, private pdf: PdfExportService, private route: ActivatedRoute) {
		this.getCandidateResumeById();
		this.formData = toSignal(this.store.select(ResumeSelectors.selectCandidate));

	}

	getCandidateResumeById() {
		if (!this.route.snapshot.params['id']) return;
		this.store.dispatch(ResumeActions.getCandidateResume({ id: this.route.snapshot.params['id'] }));
	}

	async downloadResume() {
		const el = this.resumeRef?.nativeElement;
		if (!el) return;

		await this.pdf.exportElementToPdf(el, 'resumo.pdf');
	}
}
