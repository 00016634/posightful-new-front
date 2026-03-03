import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ui-separator',
  standalone: true,
  imports: [NgClass],
  templateUrl: './separator.component.html',

  styleUrl: './separator.component.css',
})
export class SeparatorComponent {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() className = '';
}
