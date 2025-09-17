import { Route } from '@angular/router';
import { ResumeComponent } from './features/resume/pages/resume/resume';
import { Candidates } from './features/resume/pages/candidates/candidates';

export const routes: Route[] = [
    {
        path: '',
        loadComponent: () => import('./features/form-registration/pages/form/form').then(m => m.FormRegistrationShellComponent)
    },
    {
        path: 'resumes',
        component: Candidates,
    },
		{
			path: 'resumes/:id/candidate',
			component: ResumeComponent,
		}
];
