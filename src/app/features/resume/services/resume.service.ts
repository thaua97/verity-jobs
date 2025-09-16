import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataStepForm } from '@/app/shared/interfaces/steps.interfaces';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';

  getResumes(): Observable<DataStepForm[]> {
    return this.http.get<DataStepForm[]>(`${this.apiUrl}/registrations?_order=desc&_sort=id`);
  }

	deleteResume(id: string): Observable<void> {
		return this.http.delete<void>(`${this.apiUrl}/registrations/${id}`);
	}

	getCandidateResume(id: string): Observable<DataStepForm> {
		return this.http.get<DataStepForm>(`${this.apiUrl}/registrations/${id}`);
	}
}
