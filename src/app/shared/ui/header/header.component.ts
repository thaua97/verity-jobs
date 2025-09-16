import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import { MatMenuTrigger } from '@angular/material/menu';
import { TranslocoService, TranslocoModule } from '@ngneat/transloco';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";

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
  templateUrl: './header.component.html',
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
    private readonly router: Router
  ) {
    this.translocoService.setActiveLang('pt-br');
  }

  changeLanguage(lang: string): void {
    this.translocoService.setActiveLang(lang);
    this.selectedLanguage.set(lang);    
  }
}
