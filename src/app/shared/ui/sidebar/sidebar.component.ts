import { Component } from '@angular/core';
import { provideTranslocoScope } from '@ngneat/transloco';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-sidebar',
  imports: [TranslocoModule],
  templateUrl: './sidebar.component.html',
})
export class Sidebar {
  image = 'undraw_online-resume_z4sp.svg';
}
