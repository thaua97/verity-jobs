import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, throwError } from 'rxjs';

type ViaCepResponse = {
  cep?: string;
  logradouro?: string;
  complemento?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  ddd?: string;
  gia?: string;
  ibge?: string;
  siafi?: string;
  erro?: boolean;
};

export type CepResult = {
  zipCode: string;   // apenas dígitos (8)
  address: string;
  district: string;
  city: string;
  state: string;
};

@Injectable({ providedIn: 'root' })
export class CepService {
  private readonly http = inject(HttpClient);

  /**
   * Consulta o CEP na API ViaCEP
   * @param cep CEP com ou sem máscara. Será sanitizado para 8 dígitos.
   */
  lookup(cep: string): Observable<CepResult> {
    const numeric = (cep || '').replace(/\D/g, '');
    if (numeric.length !== 8) {
      return throwError(() => new Error('CEP deve conter 8 dígitos'));
    }

    const url = `https://viacep.com.br/ws/${numeric}/json/`;
    return this.http.get<ViaCepResponse>(url).pipe(
      map((res) => {
        if (!res || res.erro) {
          throw new Error('CEP não encontrado');
        }
        // Normaliza para o formato usado no StepLocation
        return {
          zipCode: numeric,
          address: res.logradouro ?? '',
          district: res.bairro ?? '',
          city: res.localidade ?? '',
          state: res.uf ?? '',
        } as CepResult;
      })
    );
  }
}