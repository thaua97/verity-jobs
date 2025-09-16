import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './shared/ui/footer/footer.component';
import { Sidebar } from "./shared/ui/sidebar/sidebar.component";
import { HeaderComponent } from "./shared/ui/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Footer, Sidebar, HeaderComponent],
  templateUrl: './app.component.html',
})
export class App {
  protected readonly title = signal('verity-jobs');
}
