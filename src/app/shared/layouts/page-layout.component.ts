import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [NgClass],
  templateUrl: './page-layout.component.html',

  styleUrl: './page-layout.component.css',
})
export class PageLayoutComponent {
  @Input() className = '';
}
