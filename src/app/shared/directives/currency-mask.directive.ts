import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCurrencyMask]',
  standalone: true,
})
export class CurrencyMaskDirective {
  private el = inject(ElementRef<HTMLInputElement>);
  private ngControl = inject(NgControl, { optional: true });

  // Helper: format a numeric value (in reais) to BRL currency
  private formatBRL(valueNumber: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valueNumber);
  }

  // Converts the raw input to only digits, dividing by 100 to represent cents
  private cleanToNumber(value: string): number {
    const digits = value.replace(/\D/g, '');
    const number = Number(digits) / 100;
    return isNaN(number) ? 0 : number;
  }

  private updateView(formatted: string, emitEvent = false) {
    this.el.nativeElement.value = formatted;
    if (this.ngControl?.control) {
      // Store the formatted string in the form control to keep what user sees
      this.ngControl.control.setValue(formatted, { emitEvent });
    }
  }

  @HostListener('input', ['$event'])
  onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const number = this.cleanToNumber(input.value);
    const formatted = this.formatBRL(number);
    // Avoid cursor jump by updating after computing
    this.updateView(formatted);
  }

  @HostListener('blur')
  onBlur() {
    const current = this.el.nativeElement.value || '';
    const number = this.cleanToNumber(current);
    this.updateView(this.formatBRL(number));
  }

  @HostListener('focus')
  onFocus() {
    // Optionally show unformatted number when focusing (commented to keep mask always visible)
    // const current = this.el.nativeElement.value || '';
    // const number = this.cleanToNumber(current);
    // this.el.nativeElement.value = number ? number.toString().replace('.', ',') : '';
  }
}
