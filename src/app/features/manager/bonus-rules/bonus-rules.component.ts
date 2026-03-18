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

  toggleActive(rule: any) {
    const newStatus = !rule.is_active;
    this.bonusService.updateRule(rule.id, { is_active: newStatus }).subscribe({
      next: () => {
        this.rules.update(rules =>
          rules.map(r => r.id === rule.id ? { ...r, is_active: newStatus } : r)
        );
        this.toastService.show('Status Updated', `Rule ${newStatus ? 'activated' : 'deactivated'}`);
      },
      error: () => this.toastService.show('Error', 'Failed to update rule status', 'destructive'),
    });
  }

  deleteRule(ruleId: number) {
    this.bonusService.deleteRule(ruleId).subscribe({
      next: () => {
        this.rules.update(rules => rules.filter(r => r.id !== ruleId));
        this.toastService.show('Rule Deleted', 'Rule deleted successfully');
      },
      error: () => this.toastService.show('Error', 'Failed to delete rule', 'destructive'),
    });
  }

  formatPayout(rule: any): string {
    if (rule.amount_type === 'percent_of_sale') {
      const cap = rule.cap_amount ? ` (cap $${rule.cap_amount})` : '';
      return `${rule.amount_value}%${cap}`;
    }
    return `$${rule.amount_value}`;
  }

  formatCondition(rule: any): string {
    if (rule.rule_dimension === 'SELL_AMOUNT') {
      return rule.operator === 'BETWEEN'
        ? `${rule.num_from} – ${rule.num_to}`
        : `${rule.num_from ?? ''}`;
    }
    if (rule.rule_dimension === 'POTENTIAL_PRODUCT') {
      return rule.text_values || rule.text_value || '';
    }
    return rule.num_from ?? rule.text_value ?? '';
  }
}
