import { Route } from '@angular/router';
import { FormRegistrationShellComponent } from './features/form-registration/pages/form/form.component';
import { ResumeComponent } from './features/resume/pages/resume/resume.component';

export const routes: Route[] = [
    {
        path: '',
        component: FormRegistrationShellComponent,
    },
    {   
        path: 'resumes',
        component: ResumeComponent
    }
];
