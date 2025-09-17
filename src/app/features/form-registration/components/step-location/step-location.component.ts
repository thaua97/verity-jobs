import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	Validators,
	AbstractControl,
	ValidationErrors,
} from '@angular/forms';
import * as StepFormSelectors from '@/app/features/form-registration/store/step-form.selectors';
import * as StepFormActions from '@/app/features/form-registration/store/step-form.actions';
import { TranslocoModule } from '@ngneat/transloco';

import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { Actions, ofType } from '@ngrx/effects';

@Component({
	selector: 'app-step-location',
	standalone: true,
	imports: [
		MatFormFieldModule,
		MatInputModule,
		MatIconModule,
		MatMenuModule,
		MatButtonToggleModule,
		ReactiveFormsModule,
		TranslocoModule,
	],
	templateUrl: './step-location.component.html',
})
export class StepLocationComponent {
	form = new FormGroup({
		address: new FormControl<string>('', {
			nonNullable: true,
			validators: [Validators.required, Validators.minLength(3)],
		}),
		district: new FormControl<string>('', {
			nonNullable: true,
			validators: [Validators.required, Validators.minLength(2)],
		}),
		zipCode: new FormControl<string>('', {
			nonNullable: true,
			validators: [Validators.required, StepLocationComponent.cepValidator()],
		}),
		city: new FormControl<string>('', {
			nonNullable: true,
			validators: [Validators.required, Validators.minLength(2)],
		}),
		state: new FormControl<string>('', {
			nonNullable: true,
			validators: [Validators.required, Validators.minLength(2)],
		}),
	});

	get isValid() {
		return this.form.valid;
	}

	constructor(private store: Store, private actions$: Actions, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
		this.handleInitialize();
		this.handleCepInput();
		this.handleCepInputFaiure();
	}

	handleInitialize() {
		this.store
			.select(StepFormSelectors.selectFormData)
			.pipe(take(1))
			.subscribe((data) => {
				if (!data) return;
				this.form.patchValue(
					{
						address: data.address ?? '',
						district: data.district ?? '',
						zipCode: StepLocationComponent.formatCep(data.zipCode ?? ''),
						city: data.city ?? '',
						state: data.state ?? '',
					},
					{ emitEvent: false }
				);
			});
	}

	handleCepInput() {
		this.actions$.pipe(ofType(StepFormActions.lookupCepSuccess)).subscribe(({ data }) => {
			// Garante execução dentro da zona do Angular e força atualização visual
			this.ngZone.run(() => {
				this.form.patchValue(
					{
						address: data.address,
						district: data.district,
						city: data.city,
						state: data.state,
						zipCode: StepLocationComponent.formatCep(data.zipCode),
					},
					{ emitEvent: true }
				);
				this.form.updateValueAndValidity({ emitEvent: true });
				// Limpa erros anteriores do CEP (ex.: cepNotFound/cepLength) e revalida
				const zipCtrl = this.form.controls.zipCode;
				zipCtrl.setErrors(null);
				zipCtrl.updateValueAndValidity({ emitEvent: false });

				this.form.markAsDirty();
				this.form.updateValueAndValidity({ emitEvent: false });

				// Força change detection para refletir imediatamente no template
				this.cdr.markForCheck();
				this.cdr.detectChanges();
			});
		});
	}

	handleCepInputFaiure() {
		this.actions$.pipe(ofType(StepFormActions.lookupCepFailure)).subscribe(() => {
			const ctrl = this.form.controls.zipCode;
			ctrl.setErrors({ ...(ctrl.errors || {}), cepNotFound: true });
			ctrl.markAsTouched();
		});
	}

	getValue() {
		const raw = this.form.getRawValue();
		const digits = (v?: string) => (v ?? '').replace(/\D/g, '');
		return {
			address: raw.address,
			district: raw.district,
			zipCode: digits(raw.zipCode),
			city: raw.city,
			state: raw.state,
		};
	}

	// ---------- Helpers ---------- //
	hasError(controlName: keyof typeof this.form.controls, error: string) {
		const ctrl = this.form.controls[controlName];
		return ctrl.touched && ctrl.hasError(error);
	}

	markAllAsTouched() {
		this.form.markAllAsTouched();
	}

	onCepInput(event: Event) {
		const input = event.target as HTMLInputElement;
		const formatted = StepLocationComponent.formatCep(input.value);
		this.form.controls.zipCode.setValue(formatted);
	}

	onCepBlur() {
		const ctrl = this.form.controls.zipCode;
		const cep = (ctrl.value ?? '').replace(/\D/g, '');

		ctrl.setErrors(null);
		if (cep.length === 0) {
			return;
		}
		if (cep.length !== 8) {
			ctrl.setErrors({ ...(ctrl.errors || {}), cepLength: true });
			ctrl.markAsTouched();
			return;
		}
		this.store.dispatch(StepFormActions.lookupCep({ zipCode: cep }));
	}

	static formatCep(value: string): string {
		const numeric = (value || '').replace(/\D/g, '').slice(0, 8);
		const p1 = numeric.slice(0, 5);
		const p2 = numeric.slice(5, 8);
		return p2 ? `${p1}-${p2}` : p1;
	}

	static cepValidator() {
		return (control: AbstractControl): ValidationErrors | null => {
			const value: string = control.value ?? '';
			const numeric = value.replace(/\D/g, '');
			if (numeric.length === 0) return null; // will be caught by required
			if (numeric.length !== 8) return { cepLength: true };
			return null;
		};
	}
}
