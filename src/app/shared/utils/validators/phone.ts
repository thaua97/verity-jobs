import { AbstractControl, ValidationErrors } from '@angular/forms';

export function phoneValidator(control: AbstractControl): ValidationErrors | null {
	// Aceita (DD) 00000-0000, 00000000000, com ou sem formatação; 10 a 11 dígitos
	const digitsOnly = /\D/g;
	const value: string = control.value ?? '';
	const numeric = value.replace(digitsOnly, '');
	if (numeric.length === 0) return null;
	if (numeric.length < 10 || numeric.length > 11) return { phoneLength: true };
	return null;
}
