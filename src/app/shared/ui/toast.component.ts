import { Component, inject } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'ui-toaster',
  standalone: true,
  imports: [NgClass, NgFor, NgIf],
  templateUrl: './toast.component.html',

  styleUrl: './toast.component.css',
})
export class ToasterComponent {
  toastService = inject(ToastService);
}
