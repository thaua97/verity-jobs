import {
	Component,
	Input,
	computed,
	Signal,
	ViewChild,
	DestroyRef,
	inject,
	AfterViewInit,
	effect,
	signal,
} from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@/app/shared/ui/confirm-dialog/confirm-dialog';

import * as StepFormActions from '@/app/features/form-registration/store/step-form.actions';
import * as StepFormSelectors from '@/app/features/form-registration/store/step-form.selectors';
import { DataStepForm } from '@/app/shared/interfaces/steps.interfaces';
import { StepOcupationComponent } from '@/app/features/form-registration/components/step-ocupation/step-ocupation';
import { StepIdentification } from '@/app/features/form-registration/components/step-identification/step-identification';
import { StepLocationComponent } from '@/app/features/form-registration/components/step-location/step-location';
import { Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { Actions, ofType } from '@ngrx/effects';


@Component({
	selector: 'app-step-wrapper',
	standalone: true,
	imports: [
		CommonModule,
		MatButtonModule,
		MatIconModule,
		StepOcupationComponent,
		StepIdentification,
		StepLocationComponent,
		MatDialogModule,
	],
	templateUrl: './form.html',
})
export class FormRegistrationShellComponent implements AfterViewInit {
	@Input() stepsCount = 3;
	@ViewChild(StepIdentification) identification?: StepIdentification;
	@ViewChild(StepLocationComponent) location?: StepLocationComponent;
	@ViewChild(StepOcupationComponent) occupation?: StepOcupationComponent;
	private destroyRef = inject(DestroyRef);

	currentStep: Signal<number | undefined>;
	formData: Signal<DataStepForm | undefined>;

	// Stable signal to avoid expression-changed errors during initial CD
	private _isCurrentStepValid = signal<boolean>(true);
	isCurrentStepValid = this._isCurrentStepValid.asReadonly();

	// Effect as field initializer to ensure injection context
	private validityEffect = effect(() => {
		const step = this.currentStepNumber; // track step changes
		const child = this.currentChild as any;
		// compute initial validity in a microtask to avoid same-cycle flip
		queueMicrotask(() => {
			this._isCurrentStepValid.set(child ? !!child.isValid : true);
		});
		// subscribe to status changes if child has a form
		const form = child?.form as { statusChanges?: any } | undefined;
		if (form?.statusChanges) {
			form.statusChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
				this._isCurrentStepValid.set(child ? !!child.isValid : true);
			});
		}
	});

	get currentStepNumber(): number {
		return this.currentStep() ?? 0;
	}

	// Helper to retrieve the active child component instance
	private get currentChild():
		| StepIdentification
		| StepLocationComponent
		| StepOcupationComponent
		| undefined {
		if (this.currentStepNumber === 0) return this.identification;
		if (this.currentStepNumber === 1) return this.location;
		if (this.currentStepNumber === 2) return this.occupation;
		return undefined;
	}

	steps = computed(() => Array.from({ length: this.stepsCount }, (_, i) => i + 1));

	constructor(
		private store: Store,
		private router: Router,
		private actions$: Actions,
		private dialog: MatDialog,
		private transloco: TranslocoService,
	) {
		this.currentStep = toSignal(this.store.select(StepFormSelectors.selectCurrentStep));
		this.formData = toSignal(this.store.select(StepFormSelectors.selectFormData));
		this.stepChange();
		this.handleRegisterSuccess();
	}

	ngAfterViewInit(): void {
		// View children are now available, validity tracking already set up in constructor
	}

	handleRegisterSuccess() {
		this.actions$
			.pipe(ofType(StepFormActions.submitFormSuccess), takeUntilDestroyed(this.destroyRef))
			.subscribe(({ id }) => {
				this.router.navigate(['resumes', id, 'candidate']);
			});
	}

	next() {
		if (this.currentStepNumber < this.stepsCount - 1) {
			if (!this.validateCurrentStep()) return;
			this.stepChange();
			this.store.dispatch(StepFormActions.nextStep());
		}
	}

	previous() {
		if (this.currentStepNumber > 0) {
			this.stepChange();
			this.store.dispatch(StepFormActions.prevStep());
		}
	}

	submit() {
		if (!this.validateCurrentStep()) return;
		this.stepChange();

		const ref = this.dialog.open(ConfirmDialogComponent, {
			data: {
				title: this.transloco.translate('dialogs.confirmSubmit.title'),
				message: this.transloco.translate('dialogs.confirmSubmit.message'),
				confirmText: this.transloco.translate('dialogs.confirmSubmit.confirm'),
				cancelText: this.transloco.translate('dialogs.confirmSubmit.cancel'),
				illustration: 'images/resume.svg',
			},
		});

		ref.afterClosed().subscribe((confirmed) => {
			if (confirmed) {
				this.store.dispatch(
					StepFormActions.submitForm({ data: this.formData() as DataStepForm })
				);
			}
		});
	}

	stepChange() {
		// Collect and save form data from the current step before moving forward/back
		if (this.currentStepNumber === 0 && this.identification) {
			const data = this.identification.getValue();
			this.store.dispatch(StepFormActions.setFormData({ data }));
		}

		if (this.currentStepNumber === 1 && this.location) {
			const data = this.location.getValue();
			this.store.dispatch(StepFormActions.setFormData({ data }));
		}

		if (this.currentStepNumber === 2 && this.occupation) {
			const data = this.occupation.getValue();
			this.store.dispatch(StepFormActions.setFormData({ data }));
		}
	}

	private validateCurrentStep(): boolean {
		const child = this.currentChild as any;
		if (!child) return true; // no child yet, allow
		if (!child.isValid) {
			child.markAllAsTouched?.();
			child.notifyErrors?.();
			return false;
		}
		return true;
	}
}
