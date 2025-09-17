import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, provideNativeDateAdapter } from '@angular/material/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as StepFormSelectors from '@/app/features/form-registration/store/step-form.selectors';
import { take } from 'rxjs/operators';
import { TranslocoModule } from '@ngneat/transloco';

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
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, TranslocoModule],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  templateUrl: './step-identification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class StepIdentification {
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
      validators: [Validators.required, StepIdentification.dateValidator()],
    }),
    phone: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, StepIdentification.phoneValidator()],
    }),
    cpf: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, StepIdentification.cpfValidator()],
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
        phone: StepIdentification.formatPhone(data.phone),
        cpf: StepIdentification.formatCpf(data.cpf),
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

  static dateValidator(minAgeYears: number = 14) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const date = value instanceof Date ? value : new Date(value);
      if (isNaN(date.getTime())) return { dateInvalid: true };
      const today = new Date();
      // Zerar horas para comparação justa
      today.setHours(0, 0, 0, 0);
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      if (d > today) return { dateInFuture: true };
      // Checa idade mínima
      const minAgeDate = new Date(today);
      minAgeDate.setFullYear(today.getFullYear() - minAgeYears);
      if (d > minAgeDate) return { minAge: { requiredAge: minAgeYears } };
      return null;
    };
  }

  static phoneValidator() {
    // Aceita (DD) 00000-0000, 00000000000, com ou sem formatação; 10 a 11 dígitos
    const digitsOnly = /\D/g;
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value ?? '';
      const numeric = value.replace(digitsOnly, '');
      if (numeric.length === 0) return null;
      if (numeric.length < 10 || numeric.length > 11) return { phoneLength: true };
      return null;
    };
  }

  static cpfValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      let value: string = control.value ?? '';
      value = value.replace(/\D/g, '');
      if (!value) return null;
      if (value.length !== 11) return { cpfLength: true };
      // Rejeita sequências repetidas
      if (/^(\d)\1{10}$/.test(value)) return { cpfInvalid: true };
      const calcCheck = (base: string): number => {
        const digits = base.split('').map(Number);
        const factorStart = base.length + 1;
        const total = digits.reduce((sum, d, i) => sum + d * (factorStart - i), 0);
        const mod = (total * 10) % 11;
        return mod === 10 ? 0 : mod;
      };
      const d1 = calcCheck(value.substring(0, 9));
      const d2 = calcCheck(value.substring(0, 10));
      if (d1 !== Number(value[9]) || d2 !== Number(value[10])) return { cpfInvalid: true };
      return null;
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

  // ---------- Masks & Formatters ---------- //
  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const formatted = StepIdentification.formatPhone(input.value);
    this.form.controls.phone.setValue(formatted);
  }

  onCpfInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const formatted = StepIdentification.formatCpf(input.value);
    this.form.controls.cpf.setValue(formatted);
  }

  static formatPhone(value: string): string {
    const digits = (value || '').replace(/\D/g, '').slice(0, 11);
    // (DD) 00000-0000 or (DD) 0000-0000 depending on length
    const ddd = digits.slice(0, 2);
    const rest = digits.slice(2);
    if (!ddd) return digits;
    if (rest.length <= 4) return `(${ddd}) ${rest}`.trim();
    if (rest.length === 5) return `(${ddd}) ${rest}`;
    if (rest.length <= 9) {
      const p1 = rest.slice(0, rest.length - 4);
      const p2 = rest.slice(-4);
      return `(${ddd}) ${p1}-${p2}`;
    }
    // 9 or more -> prefer 5+4 split
    const p1 = rest.slice(0, 5);
    const p2 = rest.slice(5, 9);
    const p3 = rest.slice(9);
    return `(${ddd}) ${p1}${p2 ? '-' + p2 : ''}${p3}`;
  }

  static formatCpf(value: string): string {
    const digits = (value || '').replace(/\D/g, '').slice(0, 11);
    const p1 = digits.slice(0, 3);
    const p2 = digits.slice(3, 6);
    const p3 = digits.slice(6, 9);
    const p4 = digits.slice(9, 11);
    let out = p1;
    if (p2) out += `.${p2}`;
    if (p3) out += `.${p3}`;
    if (p4) out += `-${p4}`;
    return out;
  }
}

