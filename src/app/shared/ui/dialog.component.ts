import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'ui-dialog',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent {
  @Input() open = false;
  @Input() className = '';
  @Output() openChange = new EventEmitter<boolean>();

  onClose() {
    this.open = false;
    this.openChange.emit(false);
  }
}

@Component({
  selector: 'ui-dialog-header',
  standalone: true,
  imports: [NgClass],
  templateUrl: './dialog-header.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogHeaderComponent {
  @Input() className = '';
}

@Component({
  selector: 'ui-dialog-title',
  standalone: true,
  imports: [NgClass],
  templateUrl: './dialog-title.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogTitleComponent {
  @Input() className = '';
}

@Component({
  selector: 'ui-dialog-description',
  standalone: true,
  imports: [NgClass],
  templateUrl: './dialog-description.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogDescriptionComponent {
  @Input() className = '';
}

@Component({
  selector: 'ui-dialog-footer',
  standalone: true,
  imports: [NgClass],
  templateUrl: './dialog-footer.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogFooterComponent {
  @Input() className = '';
}
