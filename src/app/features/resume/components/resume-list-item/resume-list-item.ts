import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatListItem } from "@angular/material/list";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@/app/shared/ui/confirm-dialog/confirm-dialog';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-resume-list-item',
  imports: [
    MatListItem,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatDialogModule,
  ],
  templateUrl: './resume-list-item.html',
})
export class ResumeListItem {
  @Input() resumeId!: string;
  @Input() name!: string;
  @Input() ocupation!: string;
  @Input() salary!: string;
  @Output() delete = new EventEmitter<string>();

  get initials(): string {
    if (!this.name) return '?';
    const parts = this.name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const second = parts[1]?.[0] ?? '';
    const res = (first + second).toUpperCase();
    return res || '?';
  }

  constructor(private dialog: MatDialog, private transloco: TranslocoService) {}

  deleteResume(id: string) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.transloco.translate('dialogs.deleteCandidate.title'),
        message: this.transloco.translate('dialogs.deleteCandidate.message'),
        confirmText: this.transloco.translate('dialogs.deleteCandidate.confirm'),
        cancelText: this.transloco.translate('dialogs.deleteCandidate.cancel'),
        illustration: 'images/delete.svg',
      },
    });

    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.delete.emit(id);
      }
    });
  }
}
