import {
	Component,
	Input,
	Output,
	EventEmitter,
	ContentChildren,
	QueryList,
	computed,
	Signal,
	ViewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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

	constructor(private store: Store) {
		this.currentStep = toSignal(this.store.select(StepFormSelectors.selectCurrentStep));
		this.formData = toSignal(this.store.select(StepFormSelectors.selectFormData));
		this.stepChange();
	}

	steps = computed(() => Array.from({ length: this.stepsCount }, (_, i) => i + 1));

	get currentStepNumber(): number {
		return this.currentStep() ?? 0;
	}

	next() {
		if (this.currentStepNumber < this.stepsCount - 1) {
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
}
