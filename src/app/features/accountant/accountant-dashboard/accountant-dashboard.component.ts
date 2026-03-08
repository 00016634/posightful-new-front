import { Component, inject, signal, computed } from '@angular/core';
import { PageLayoutComponent } from '../../../shared/layouts/page-layout.component';
import {
  CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
  ButtonComponent, LabelComponent, AvatarComponent, BadgeComponent,
  TableComponent, TableHeaderComponent, TableBodyComponent,
  TableRowComponent, TableHeadComponent, TableCellComponent,
} from '../../../shared/ui';
import { ToastService } from '../../../shared/ui/toast.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accountant-dashboard',
  standalone: true,
  imports: [
    PageLayoutComponent,
    CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
    ButtonComponent, LabelComponent, AvatarComponent, BadgeComponent,
    TableComponent, TableHeaderComponent, TableBodyComponent,
    TableRowComponent, TableHeadComponent, TableCellComponent,
  ],
  templateUrl: './accountant-dashboard.component.html',

  styleUrl: './accountant-dashboard.component.css',
})
export class AccountantDashboardComponent {
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  Math = Math;
  selectedYear = signal('2026');
  selectedMonth = signal('01');
  showData = signal(false);
  months = [
    { value: '01', label: 'January' }, { value: '02', label: 'February' }, { value: '03', label: 'March' },
    { value: '04', label: 'April' }, { value: '05', label: 'May' }, { value: '06', label: 'June' },
    { value: '07', label: 'July' }, { value: '08', label: 'August' }, { value: '09', label: 'September' },
    { value: '10', label: 'October' }, { value: '11', label: 'November' }, { value: '12', label: 'December' },
  ];
  bonusSummary = [
    { agentName: 'John Smith', agentCode: 'AG-001', totalBonus: 2730, conversions: 18, totalSales: 27300 },
    { agentName: 'Sarah Johnson', agentCode: 'AG-003', totalBonus: 2275, conversions: 15, totalSales: 22750 },
    { agentName: 'Michael Brown', agentCode: 'AG-005', totalBonus: 2480, conversions: 16, totalSales: 24800 },
    { agentName: 'Emily Davis', agentCode: 'AG-007', totalBonus: 2120, conversions: 14, totalSales: 21200 },
    { agentName: 'Maria Garcia', agentCode: 'SUP-042', totalBonus: 14850, conversions: 98, totalSales: 148500 },
  ];
  bonusDetails = [
    { id: '1', agentName: 'John Smith', agentCode: 'AG-001', leadId: 'LD-10023', customerName: 'Robert Davis', saleAmount: 5500, saleDate: 'Jan 18, 2026', ruleName: 'High Value Sale Bonus', ruleType: '15% of sale (cap $1000)', bonusAmount: 825, calculation: '$5,500 x 15% = $825' },
    { id: '2', agentName: 'John Smith', agentCode: 'AG-001', leadId: 'LD-10020', customerName: 'Patricia Martinez', saleAmount: 850, saleDate: 'Jan 17, 2026', ruleName: 'Quick Conversion Bonus', ruleType: 'Fixed amount', bonusAmount: 100, calculation: 'Lead to sale in 1 day = $100' },
    { id: '3', agentName: 'Sarah Johnson', agentCode: 'AG-003', leadId: 'LD-10019', customerName: 'Michael Wilson', saleAmount: 6200, saleDate: 'Jan 16, 2026', ruleName: 'High Value Sale Bonus', ruleType: '15% of sale (cap $1000)', bonusAmount: 930, calculation: '$6,200 x 15% = $930' },
    { id: '4', agentName: 'Michael Brown', agentCode: 'AG-005', leadId: 'LD-10017', customerName: 'James Anderson', saleAmount: 4800, saleDate: 'Jan 15, 2026', ruleName: 'Premium Product Bonus', ruleType: '12% of sale (cap $800)', bonusAmount: 576, calculation: '$4,800 x 12% = $576' },
  ];
  totalBonus = computed(() => this.bonusSummary.reduce((s, a) => s + a.totalBonus, 0));
  totalConversions = computed(() => this.bonusSummary.reduce((s, a) => s + a.conversions, 0));
  totalSales = computed(() => this.bonusSummary.reduce((s, a) => s + a.totalSales, 0));
  generate() { this.showData.set(true); this.toastService.show('Reports Generated', 'Bonus reports generated successfully'); }
  exportCSV(type: string) { this.toastService.show('Exported', `${type === 'summary' ? 'Summary' : 'Audit details'} exported to CSV`); }
  getMonthLabel(): string { return this.months.find(m => m.value === this.selectedMonth())?.label || ''; }
  initials(name: string): string { return name.split(' ').map(n => n[0]).join(''); }
  fmt(value: number): string { return value.toLocaleString(); }
}
