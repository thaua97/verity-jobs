import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatDatepickerModule, MatDatepicker } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, provideNativeDateAdapter } from '@angular/material/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as StepFormSelectors from '@/app/features/form-registration/store/step-form.selectors';
import { take } from 'rxjs/operators';
import { TranslocoModule } from '@ngneat/transloco';
import { dateValidator, phoneValidator, cpfValidator } from '@/app/shared/validators/form.validators';
import { PhoneMaskDirective } from '@/app/shared/directives/phone-mask.directive';
import { CpfMaskDirective } from '@/app/shared/directives/cpf-mask.directive';
import { formatPhone, formatCpf } from '@/app/shared/utils/formatters';
import { MatIconModule } from '@angular/material/icon';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-step-identification',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
		MatIconModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    TranslocoModule,
    PhoneMaskDirective,
    CpfMaskDirective,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  templateUrl: './step-identification.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class StepIdentification {
  @ViewChild('picker') datePicker!: MatDatepicker<Date>;

  form = new FormGroup({
    name: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        // Apenas letras (inclui acentos) e espaços, mínimo 3 caracteres
        Validators.pattern(/^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ ]+[A-Za-zÀ-ÿ]$/),
      ],
    }),
    birthDate: new FormControl<string | Date>('', {
      nonNullable: true,
      validators: [Validators.required, dateValidator()],
    }),
    phone: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, phoneValidator()],
    }),
    cpf: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, cpfValidator()],
    }),
  });

  // Max date for datepicker (today)
  public readonly maxDate: Date = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  constructor(private store: Store) {
    this.handleInitialize();
  }

  handleInitialize() {
    this.store.select(StepFormSelectors.selectFormData).pipe(take(1)).subscribe(data => {
      if (!data) return;
      this.form.patchValue({
        name: data.name ?? '',
        birthDate: data.birthDate ?? '',
        phone: formatPhone(data.phone),
        cpf: formatCpf(data.cpf),
      }, { emitEvent: false });
    });
  }

  getValue() {
    const raw = this.form.getRawValue();
    const birthDateStr = typeof raw.birthDate === 'string'
      ? raw.birthDate
      : raw.birthDate instanceof Date
        ? raw.birthDate.toISOString()
        : '';
    const onlyDigits = (v?: string) => (v ?? '').replace(/\D/g, '');
    return {
      name: raw.name,
      birthDate: birthDateStr,
      phone: onlyDigits(raw.phone),
      cpf: onlyDigits(raw.cpf),
    };
  }


  hasError(controlName: keyof typeof this.form.controls, error: string) {
    const ctrl = this.form.controls[controlName];
    return ctrl.touched && ctrl.hasError(error);
  }

  markAllAsTouched() {
    this.form.markAllAsTouched();
  }

  get isValid() {
    return this.form.valid;
  }

  openDatePicker() {
    this.datePicker.open();
  }

}

