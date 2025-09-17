import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateValidator(minAgeYears: number = 14): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    
    // Handle Date objects (from datepicker)
    if (value instanceof Date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const d = new Date(value);
      d.setHours(0, 0, 0, 0);
      if (d > today) return { dateInFuture: true };
      const minAgeDate = new Date(today);
      minAgeDate.setFullYear(today.getFullYear() - minAgeYears);
      if (d > minAgeDate) return { minAge: { requiredAge: minAgeYears } };
      return null;
    }
    
    // Handle string input (typed dates)
    if (typeof value === 'string') {
      const digits = value.replace(/\D/g, '');
      
      // Allow partial input while typing
      if (digits.length > 0 && digits.length < 8) {
        return null;
      }
      
      // Validate complete date (8 digits)
      if (digits.length === 8) {
        const dd = Number(digits.slice(0, 2));
        const mm = Number(digits.slice(2, 4));
        const yyyy = Number(digits.slice(4, 8));
        
        // Check if date parts are valid
        if (!isValidDateParts(dd, mm, yyyy)) {
          return { dateInvalid: true };
        }
        
        // Create date and validate
        const date = new Date(yyyy, mm - 1, dd);
        if (isNaN(date.getTime())) {
          return { dateInvalid: true };
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        
        if (d > today) return { dateInFuture: true };
        
        const minAgeDate = new Date(today);
        minAgeDate.setFullYear(today.getFullYear() - minAgeYears);
        if (d > minAgeDate) return { minAge: { requiredAge: minAgeYears } };
        
        return null;
      }
      
      // Invalid format
      return { dateInvalid: true };
    }
    
    return { dateInvalid: true };
  };
}

export function phoneValidator(): ValidatorFn {
  const digitsOnly = /\D/g;
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value ?? '';
    const numeric = value.replace(digitsOnly, '');
    if (numeric.length === 0) return null;
    if (numeric.length < 10 || numeric.length > 11) return { phoneLength: true };
    return null;
  };
}

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let value: string = control.value ?? '';
    value = value.replace(/\D/g, '');
    if (!value) return null;
    if (value.length !== 11) return { cpfLength: true };
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

export function parseDateFromDDMMYYYY(value: string): Date | null {
  if (!value) return null;
  const digits = value.replace(/\D/g, '');
  if (digits.length !== 8) return null;
  const dd = Number(digits.slice(0, 2));
  const mm = Number(digits.slice(2, 4));
  const yyyy = Number(digits.slice(4, 8));
  if (!isValidDateParts(dd, mm, yyyy)) return null;
  const date = new Date(yyyy, mm - 1, dd);
  return isNaN(date.getTime()) ? null : date;
}

export function isValidDateParts(dd: number, mm: number, yyyy: number): boolean {
  if (yyyy < 1900 || yyyy > 9999) return false;
  if (mm < 1 || mm > 12) return false;
  const daysInMonth = new Date(yyyy, mm, 0).getDate();
  if (dd < 1 || dd > daysInMonth) return false;
  return true;
}
