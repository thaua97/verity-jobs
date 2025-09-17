import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appDateMask]',
  standalone: true,
})
export class DateMaskDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Limit to 8 digits
    const limitedDigits = digits.slice(0, 8);
    
    // Format as DD/MM/YYYY
    let formatted = limitedDigits;
    if (limitedDigits.length >= 3) {
      formatted = limitedDigits.slice(0, 2) + '/' + limitedDigits.slice(2);
    }
    if (limitedDigits.length >= 5) {
      formatted = limitedDigits.slice(0, 2) + '/' + limitedDigits.slice(2, 4) + '/' + limitedDigits.slice(4);
    }
    
    // Update form control only
    this.ngControl.control?.setValue(formatted);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow control keys
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    
    // Allow navigation and editing keys
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Enter', 'Escape',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 
      'Home', 'End', 'PageUp', 'PageDown'
    ];
    if (allowedKeys.includes(event.key)) return;
    
    // Allow digits (0-9) from main keyboard and numpad
    if (/^[0-9]$/.test(event.key)) return;
    
    // Block everything else
    event.preventDefault();
  }
}
