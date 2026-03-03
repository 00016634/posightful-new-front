import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageLayoutComponent } from '../../../shared/layouts/page-layout.component';
import {
  CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
  ButtonComponent, BadgeComponent,
  TableComponent, TableHeaderComponent, TableBodyComponent,
  TableRowComponent, TableHeadComponent, TableCellComponent,
} from '../../../shared/ui';
import { BonusService } from '../../../core/services/bonus.service';
import { ToastService } from '../../../shared/ui/toast.service';

@Component({
  selector: 'app-bonus-rules',
  standalone: true,
  imports: [
    PageLayoutComponent,
    CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
    ButtonComponent, BadgeComponent,
    TableComponent, TableHeaderComponent, TableBodyComponent,
    TableRowComponent, TableHeadComponent, TableCellComponent,
  ],
  templateUrl: './bonus-rules.component.html',

  styleUrl: './bonus-rules.component.css',
})
export class BonusRulesComponent implements OnInit {
  router = inject(Router);
  private bonusService = inject(BonusService);
  private toastService = inject(ToastService);

  rules = signal<any[]>([]);

  ngOnInit() {
    this.bonusService.getBonusRules().subscribe(data => this.rules.set(data));
  }

  toggleActive(ruleId: number) {
    this.rules.update(rules =>
      rules.map(r => r.id === ruleId ? { ...r, isActive: !r.isActive } : r)
    );
    this.toastService.show('Status Updated', 'Rule status updated');
  }

  deleteRule(ruleId: number) {
    this.rules.update(rules => rules.filter(r => r.id !== ruleId));
    this.toastService.show('Rule Deleted', 'Rule deleted successfully');
  }
}
