import { Component, signal } from '@angular/core';
import { HeaderComponent } from './shared/ui/header/header';
import { Footer } from './shared/ui/footer/footer';
import { Sidebar } from './shared/ui/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Footer, Sidebar, HeaderComponent],
  templateUrl: './app.component.html',
})
export class App {
  protected readonly title = signal('verity-jobs');
}
