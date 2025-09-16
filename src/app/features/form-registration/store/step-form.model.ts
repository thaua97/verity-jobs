import { DataStepForm } from "@/app/shared/interfaces/steps.interfaces";

export interface StepFormState {
  step: number;
  data: DataStepForm;
  loading: boolean;
  error: string | null;
}
