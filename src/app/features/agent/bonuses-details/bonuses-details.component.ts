import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { PageLayoutComponent } from '../../../shared/layouts/page-layout.component';
import {
  CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
  ButtonComponent, TableComponent, TableHeaderComponent, TableBodyComponent,
  TableRowComponent, TableHeadComponent, TableCellComponent, ScrollAreaComponent,
} from '../../../shared/ui';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-bonuses-details',
  standalone: true,
  imports: [
    DecimalPipe,
    PageLayoutComponent,
    CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
    ButtonComponent, TableComponent, TableHeaderComponent, TableBodyComponent,
    TableRowComponent, TableHeadComponent, TableCellComponent, ScrollAreaComponent,
  ],
  templateUrl: './bonuses-details.component.html',

  styleUrl: './bonuses-details.component.css',
})
export class BonusesDetailsComponent implements OnInit {
  router = inject(Router);
  private productService = inject(ProductService);

  conversions = signal<any[]>([]);

  totalPurchases = computed(() =>
    this.conversions().reduce((sum, c) => sum + c.purchaseAmount, 0)
  );

  totalBonuses = computed(() =>
    this.conversions().reduce((sum, c) => sum + c.bonusReceived, 0)
  );

  ngOnInit() {
    this.productService.getConversions().subscribe(data => this.conversions.set(data));
  }
}
