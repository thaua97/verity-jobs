import { AbstractControl, ValidationErrors } from '@angular/forms';

export function cpfValidator(control: AbstractControl): ValidationErrors | null {
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
}
