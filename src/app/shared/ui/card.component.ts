import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() className = '';
}

@Component({
  selector: 'ui-card-header',
  standalone: true,
  imports: [NgClass],
  templateUrl: './card-header.component.html',
  styleUrl: './card.component.css',
})
export class CardHeaderComponent {
  @Input() className = '';
}

@Component({
  selector: 'ui-card-title',
  standalone: true,
  imports: [NgClass],
  templateUrl: './card-title.component.html',
  styleUrl: './card.component.css',
})
export class CardTitleComponent {
  @Input() className = '';
}

@Component({
  selector: 'ui-card-description',
  standalone: true,
  imports: [NgClass],
  templateUrl: './card-description.component.html',
  styleUrl: './card.component.css',
})
export class CardDescriptionComponent {
  @Input() className = '';
}

@Component({
  selector: 'ui-card-content',
  standalone: true,
  imports: [NgClass],
  templateUrl: './card-content.component.html',
  styleUrl: './card.component.css',
})
export class CardContentComponent {
  @Input() className = '';
}

@Component({
  selector: 'ui-card-footer',
  standalone: true,
  imports: [NgClass],
  templateUrl: './card-footer.component.html',
  styleUrl: './card.component.css',
})
export class CardFooterComponent {
  @Input() className = '';
}
