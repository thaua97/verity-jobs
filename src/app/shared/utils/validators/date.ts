import { AbstractControl, ValidationErrors } from '@angular/forms';

export function dateValidator(minAgeYears: number = 14) {
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
