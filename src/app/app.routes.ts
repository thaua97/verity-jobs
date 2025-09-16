import { Route } from '@angular/router';
import { FormRegistrationShellComponent } from './features/form-registration/pages/form/form.component';
import { ResumeComponent } from './features/resume/pages/resume/resume.component';
import { Resumes } from './features/resume/pages/resumes/resumes';

export const routes: Route[] = [
    {
        path: '',
        component: FormRegistrationShellComponent,
    },
    {
        path: 'resumes',
        component: Resumes,
    },
		{
			path: 'resumes/:id/candidate',
			component: ResumeComponent,
		}
];
