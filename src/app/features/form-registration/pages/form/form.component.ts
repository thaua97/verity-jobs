import { Component, signal } from '@angular/core';
import { StepWrapperComponent } from '../../components/step-wrapper/step-wrapper.component';
import { StepIdentification } from "../../components/step-identification/step-identification.component";
import { StepOcupationComponent } from "../../components/step-ocupation/step-ocupation.component";
import { StepLocationComponent } from "../../components/step-location/step-location.component";

@Component({
  selector: 'app-form-registration-shell',
  imports: [
    StepWrapperComponent, 
    StepIdentification, 
    StepOcupationComponent, 
    StepLocationComponent
  ],
  templateUrl: './form.component.html',
})
export class FormRegistrationShellComponent {
  currentStep = signal(0);

  stepChange(step: number) {
    this.currentStep.set(step);
  }
}
