import { Component, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './page-header.component.html',

  styleUrl: './page-header.component.css',
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() backRoute = '';
  @Input() className = '';

  constructor(private router: Router) {}

  goBack() {
    this.router.navigateByUrl(this.backRoute);
  }
}
