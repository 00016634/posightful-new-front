import { Component, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { CardComponent, CardContentComponent } from '../ui/card.component';

@Component({
  selector: 'app-analytics-card',
  standalone: true,
  imports: [NgClass, NgIf, CardComponent, CardContentComponent],
  templateUrl: './analytics-card.component.html',

  styleUrl: './analytics-card.component.css',
})
export class AnalyticsCardComponent {
  @Input() title = '';
  @Input() value = '';
  @Input() trend = '';
  @Input() trendUp = true;
  @Input() icon = false;
  @Input() className = '';
}
