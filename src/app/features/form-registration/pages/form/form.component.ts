import {
	Component,
	Input,
	computed,
	Signal,
	ViewChild,
	DestroyRef,
	inject,
} from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import * as StepFormActions from '@/app/features/form-registration/store/step-form.actions';
import * as StepFormSelectors from '@/app/features/form-registration/store/step-form.selectors';
import { DataStepForm } from '@/app/shared/interfaces/steps.interfaces';
import { StepOcupationComponent } from '@/app/features/form-registration/components/step-ocupation/step-ocupation.component';
import { StepIdentification } from '@/app/features/form-registration/components/step-identification/step-identification.component';
import { StepLocationComponent } from '@/app/features/form-registration/components/step-location/step-location.component';
import { Router } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { mergeMap, take } from 'rxjs';
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
	],
	templateUrl: './form.component.html',
})
export class FormRegistrationShellComponent {
	@Input() stepsCount = 3;
	@ViewChild(StepIdentification) identification?: StepIdentification;
	@ViewChild(StepLocationComponent) location?: StepLocationComponent;
	@ViewChild(StepOcupationComponent) occupation?: StepOcupationComponent;

	currentStep: Signal<number | undefined>;
	formData: Signal<DataStepForm | undefined>;

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

	get isCurrentStepValid(): boolean {
		const child = this.currentChild as any;
		return child ? !!child.isValid : true;
	}

	steps = computed(() => Array.from({ length: this.stepsCount }, (_, i) => i + 1));

	constructor(private store: Store, private router: Router, private actions$: Actions) {
		this.currentStep = toSignal(this.store.select(StepFormSelectors.selectCurrentStep));
		this.formData = toSignal(this.store.select(StepFormSelectors.selectFormData));
		this.stepChange();
		this.handleRegisterSuccess();
	}

	handleRegisterSuccess() {
		const destroyRef = inject(DestroyRef);
		this.actions$
			.pipe(ofType(StepFormActions.submitFormSuccess), takeUntilDestroyed(destroyRef))
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
		this.store.dispatch(StepFormActions.submitForm({ data: this.formData() as DataStepForm }));
	}

	stepChange() {
		// Collect and save form data from the current step before moving forward/back
		if (this.currentStepNumber === 0 && this.identification) {
			const data = this.identification.getValue();
			this.store.dispatch(StepFormActions.setFormData({ data }));
			console.log('data 1', data);
		}

		if (this.currentStepNumber === 1 && this.location) {
			const data = this.location.getValue();
			this.store.dispatch(StepFormActions.setFormData({ data }));
			console.log('data 2', data);
		}

		if (this.currentStepNumber === 2 && this.occupation) {
			const data = this.occupation.getValue();
			this.store.dispatch(StepFormActions.setFormData({ data }));
			console.log('data 3', data);
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
