import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { MatMenuTrigger } from '@angular/material/menu';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";
import { Store } from '@ngrx/store';
import * as StepFormActions from '@/app/features/form-registration/store/step-form.actions';

@Component({
  selector: 'app-header',
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatMenuTrigger,
    TranslocoModule,
    RouterLink,
    MatIconModule
],
  templateUrl: './header.html',
})
export class HeaderComponent {
  selectedLanguage = signal('pt-br');

  languages = computed(() => [
    { value: 'pt-br', label: 'Português' },
    { value: 'en-us', label: 'English' },
    { value: 'es-es', label: 'Espanhol' }
  ]);

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly router: Router,
    private readonly store: Store
  ) {
    this.translocoService.setActiveLang('pt-br');
  }

  changeLanguage(lang: string): void {
    this.translocoService.setActiveLang(lang);
    this.selectedLanguage.set(lang);
  }

  navigateToHome(): void {
    // Limpar o formulário e resetar para o primeiro step
    this.store.dispatch(StepFormActions.setFormData({ 
      data: {
        name: '',
        birthDate: '',
        phone: '',
        cpf: '',
        zipCode: '',
        address: '',
        district: '',
        city: '',
        state: '',
        ocupation: '',
        company: '',
        salary: '',
        skills: []
      }
    }));
    this.store.dispatch(StepFormActions.setStep({ step: 0 }));
    // Navegar para a home
    this.router.navigate(['/']);
  }
}
