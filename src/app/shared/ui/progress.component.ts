import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ui-progress',
  standalone: true,
  imports: [NgClass],
  templateUrl: './progress.component.html',

  styleUrl: './progress.component.css',
})
export class ProgressComponent {
  @Input() value: number | null = 0;
  @Input() className = '';
}
