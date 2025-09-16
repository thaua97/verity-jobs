import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataStepForm } from '@/app/shared/interfaces/steps.interfaces';
import { inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';

  submitRegistration(data: DataStepForm): Observable<DataStepForm> {
    return this.http.post<DataStepForm>(`${this.apiUrl}/registrations`, data);
  }
}
