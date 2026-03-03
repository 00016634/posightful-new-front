import { Component, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'ui-avatar',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './avatar.component.html',

  styleUrl: './avatar.component.css',
})
export class AvatarComponent {
  @Input() src = '';
  @Input() alt = '';
  @Input() fallback = '';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() className = '';

  imgError = false;

  get sizeClass(): string {
    switch (this.size) {
      case 'sm': return 'h-8 w-8';
      case 'lg': return 'h-12 w-12';
      default: return 'h-10 w-10';
    }
  }
}
