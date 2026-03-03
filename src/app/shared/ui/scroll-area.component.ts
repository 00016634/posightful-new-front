import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ui-scroll-area',
  standalone: true,
  imports: [NgClass],
  templateUrl: './scroll-area.component.html',

  styleUrl: './scroll-area.component.css',
})
export class ScrollAreaComponent {
  @Input() maxHeight = '100%';
  @Input() className = '';
}
