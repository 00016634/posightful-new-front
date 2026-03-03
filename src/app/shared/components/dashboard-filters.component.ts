import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dashboard-filters',
  standalone: true,
  templateUrl: './dashboard-filters.component.html',

  styleUrl: './dashboard-filters.component.css',
})
export class DashboardFiltersComponent {
  @Input() timeRange = 'this_month';
  @Input() selectedProduct = '';
  @Input() products: string[] = [];
  @Output() timeRangeChange = new EventEmitter<string>();
  @Output() selectedProductChange = new EventEmitter<string>();

  onTimeRangeChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.timeRange = val;
    this.timeRangeChange.emit(val);
  }

  onProductChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.selectedProduct = val;
    this.selectedProductChange.emit(val);
  }
}
