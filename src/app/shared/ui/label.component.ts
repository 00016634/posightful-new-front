import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ui-label',
  standalone: true,
  imports: [NgClass],
  templateUrl: './label.component.html',

  styleUrl: './label.component.css',
})
export class LabelComponent {
  @Input() htmlFor = '';
  @Input() className = '';
}
