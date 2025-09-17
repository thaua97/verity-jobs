import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataStepForm, Ocupations } from '@/app/shared/interfaces/steps.interfaces';
import { inject } from '@angular/core';
import { environment } from '@/environments/environment.mock';

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  submitRegistration(data: DataStepForm): Observable<DataStepForm> {
    return this.http.post<DataStepForm>(`${this.apiUrl}/registrations`, data);
  }

  getOcupations(): Observable<Ocupations[]> {
    return this.http.get<Ocupations[]>(`${this.apiUrl}/ocupations`);
  }
}
