import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

const variantClasses: Record<string, string> = {
  default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
  secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
  destructive: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
  outline: 'text-foreground',
};

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [NgClass],
  templateUrl: './badge.component.html',

  styleUrl: './badge.component.css',
})
export class BadgeComponent {
  @Input() variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'default';
  @Input() className = '';

  get computedClasses(): string {
    return [
      'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      variantClasses[this.variant],
      this.className,
    ].join(' ');
  }
}
