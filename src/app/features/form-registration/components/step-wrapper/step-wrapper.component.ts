import { Component, Input, Output, EventEmitter, ContentChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepTemplateDirective } from './step.directive';

@Component({
  selector: 'app-step-wrapper',
  imports: [CommonModule],
  templateUrl: './step-wrapper.component.html',
})

export class StepWrapperComponent {
  @Input() stepsCount = 1;
  @Input() currentStep = 0;
  @Output() stepChange = new EventEmitter<number>();

  @ContentChildren(StepTemplateDirective) stepsTemplates!: QueryList<StepTemplateDirective>;

  get currentTemplate() {
    return this.stepsTemplates?.find(stepDir => stepDir.step === this.currentStep + 1)?.template ?? null;
  }

  next() {
    if (this.currentStep < this.stepsCount - 1) {
      this.currentStep++;
      this.stepChange.emit(this.currentStep);
    }
  }

  previous() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.stepChange.emit(this.currentStep);
    }
  }
}

