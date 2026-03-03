import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { CardComponent, CardContentComponent, CardHeaderComponent, CardTitleComponent } from '../ui/card.component';

@Component({
  selector: 'app-bonuses-card',
  standalone: true,
  imports: [NgIf, CardComponent, CardContentComponent, CardHeaderComponent, CardTitleComponent],
  templateUrl: './bonuses-card.component.html',

  styleUrl: './bonuses-card.component.css',
})
export class BonusesCardComponent {
  @Input() title = 'Bonuses';
  @Input() totalEarned = '';
  @Input() pending = '';
  @Input() paid = '';
}
