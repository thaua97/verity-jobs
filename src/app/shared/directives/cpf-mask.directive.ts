import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { formatCpf } from '@/app/shared/utils/formatters';

@Directive({
  selector: '[appCpfMask]',
  standalone: true,
})
export class CpfMaskDirective {
  constructor(private ngControl: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const masked = formatCpf(input.value);
    this.ngControl.control?.setValue(masked, { emitEvent: true });
  }
}
