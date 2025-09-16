import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatListItem } from "@angular/material/list";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-resume-list-item',
  imports: [
		MatListItem,
		MatButtonModule,
		MatIconModule,
		RouterLink,
	],
  templateUrl: './resume-list-item.html',
})
export class ResumeListItem {
	@Input() resumeId!: string;
	@Input() name!: string;
	@Input() ocupation!: string;
	@Input() salary!: string;
	@Output() delete = new EventEmitter<string>();


	deleteResume(id: string) {
		this.delete.emit(id);
	}
}
