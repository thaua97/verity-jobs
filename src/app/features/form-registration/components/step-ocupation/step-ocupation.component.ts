import { Component, Signal, computed } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as StepFormSelectors from '@/app/features/form-registration/store/step-form.selectors';
import * as StepFormActions from '@/app/features/form-registration/store/step-form.actions';
import { take } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { Ocupations } from '@/app/shared/interfaces/steps.interfaces';
import { toSignal,  } from '@angular/core/rxjs-interop';
import { CurrencyMaskDirective } from '@/app/shared/directives/currency-mask.directive';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
	selector: 'app-step-ocupation',
	standalone: true,
	imports: [
		MatFormFieldModule,
		MatInputModule,
		ReactiveFormsModule,
		MatSnackBarModule,
		MatSelectModule,
		CurrencyMaskDirective,
		MatIconModule,
		TranslocoModule
	],
	templateUrl: './step-ocupation.component.html',
})
export class StepOcupationComponent {
	form = new FormGroup({
		ocupation: new FormControl<string>('', {
			nonNullable: true,
			validators: [Validators.required, Validators.minLength(2)],
		}),
		company: new FormControl<string>('', {
			nonNullable: true,
			validators: [Validators.required, Validators.minLength(2)],
		}),
		salary: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
		// Use a string control for a comma-separated input field
		skills: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
	});

	ocupations: Signal<Ocupations[] | [] | undefined>;
	hasOcupations = computed(() => this.ocupations() !== undefined && this.ocupations()!.length > 0);

	constructor(private store: Store, private snackBar: MatSnackBar) {
		this.handleInitialize();
		this.ocupations = toSignal(this.store.select(StepFormSelectors.selectOcupations));
	}

	handleInitialize() {
		this.store.dispatch(StepFormActions.getOcupations());
		this.store
			.select(StepFormSelectors.selectFormData)
			.pipe(take(1))
			.subscribe((data) => {
				if (!data) return;
				this.form.patchValue(
					{
						ocupation: data.ocupation ?? '',
						company: (data.company as any) ?? '',
						salary: data.salary ?? '',
						skills: Array.isArray(data.skills) ? data.skills.join(', ') : '',
					},
					{ emitEvent: false }
				);
			});
	}

	getValue() {
		const raw = this.form.getRawValue();
		const skillsArray = raw.skills
			.split(',')
			.map((s: string) => s.trim())
			.filter(Boolean);
		return { ...raw, skills: skillsArray };
	}

	// Expose validation helpers for parent component
	markAllAsTouched() {
		this.form.markAllAsTouched();
	}

	get isValid() {
		return this.form.valid;
	}

	notifyErrors() {
		if (this.form.valid) return;
		const messages: string[] = [];
		const { ocupation, company, salary, skills } = this.form.controls;

		if (ocupation.errors) {
			if (ocupation.errors['required']) messages.push('Profissão é obrigatória.');
			if (ocupation.errors['minlength']) messages.push('Profissão deve ter ao menos 2 caracteres.');
		}

		if (company.errors) {
			if (company.errors['required']) messages.push('Empresa é obrigatória.');
			if (company.errors['minlength']) messages.push('Empresa deve ter ao menos 2 caracteres.');
		}

		if (salary.errors) {
			if (salary.errors['required']) messages.push('Salário é obrigatório.');
		}

		if (skills.errors) {
			if (skills.errors['required']) messages.push('Habilidades são obrigatórias.');
		}

		const message = messages.length ? messages.join('\n') : 'Preencha os campos obrigatórios.';
		this.snackBar.open(message, 'OK', {
			duration: 5000,
			panelClass: ['mat-mdc-snack-bar-container'],
		});
	}
}
