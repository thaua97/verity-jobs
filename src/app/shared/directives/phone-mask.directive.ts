import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { formatPhone } from '@/app/shared/utils/formatters';

@Directive({
  selector: '[appPhoneMask]',
  standalone: true,
})
export class PhoneMaskDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const masked = formatPhone(input.value);
    this.ngControl.control?.setValue(masked, { emitEvent: true });
  }
}
