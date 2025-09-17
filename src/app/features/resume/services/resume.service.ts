import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataStepForm, ResponsePaginated } from '@/app/shared/interfaces/steps.interfaces';
import { environment } from '@/environments/environment';

@Injectable({ providedIn: 'root' })
export class ResumeService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getResumes(page: number, pageSize: number) {
    const params = new HttpParams()
      .set('_page', String(page))
      .set('_per_page', String(pageSize))
      .set('_order', 'desc')

    return this.http.get<ResponsePaginated>(`${this.apiUrl}/registrations`, {
      params,
      observe: 'response',
    });
  }

	deleteResume(id: string): Observable<void> {
		return this.http.delete<void>(`${this.apiUrl}/registrations/${id}`);
	}

	getCandidateResume(id: string): Observable<DataStepForm> {
		return this.http.get<DataStepForm>(`${this.apiUrl}/registrations/${id}`);
	}
}
