import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[step]'
})
export class StepTemplateDirective {
  @Input('step') step!: number;
  constructor(public template: TemplateRef<any>) {}
}
