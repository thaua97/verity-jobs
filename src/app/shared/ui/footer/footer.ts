import { Component } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './footer.html',
})
export class Footer {

}
