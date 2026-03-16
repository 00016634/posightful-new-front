import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageLayoutComponent, PageHeaderComponent } from '../../../shared/layouts';
import {
  TableComponent,
  TableHeaderComponent,
  TableBodyComponent,
  TableRowComponent,
  TableHeadComponent,
  TableCellComponent,
  AvatarComponent,
  BadgeComponent,
  CardComponent,
  CardContentComponent,
} from '../../../shared/ui';
import { AgentService } from '../../../core/services/agent.service';
import { AnalyticsService } from '../../../core/services/analytics.service';

@Component({
  selector: 'app-all-agents',
  standalone: true,
  imports: [
    PageLayoutComponent,
    PageHeaderComponent,
    TableComponent,
    TableHeaderComponent,
    TableBodyComponent,
    TableRowComponent,
    TableHeadComponent,
    TableCellComponent,
    AvatarComponent,
    BadgeComponent,
    CardComponent,
    CardContentComponent,
  ],
  templateUrl: './all-agents.component.html',
  styleUrl: './all-agents.component.css',
})
export class AllAgentsComponent implements OnInit {
  private agentService = inject(AgentService);
  private analyticsService = inject(AnalyticsService);
  private router = inject(Router);

  personnel = signal<any[]>([]);
  searchTerm = signal('');
  roleFilter = signal('all');
  regionFilter = signal('all');
  statusFilter = signal('all');

  regions = computed(() => {
    const allRegions = this.personnel().map(p => p.region);
    return [...new Set(allRegions)].filter(Boolean).sort();
  });

  filteredPersonnel = computed(() => {
    let list = this.personnel();
    const term = this.searchTerm().toLowerCase();
    if (term) {
      list = list.filter(p =>
        (p.fullName || '').toLowerCase().includes(term) ||
        (p.agentCode || '').toLowerCase().includes(term) ||
        (p.region || '').toLowerCase().includes(term)
      );
    }
    if (this.roleFilter() !== 'all') {
      list = list.filter(p => (p.role || '').toLowerCase() === this.roleFilter());
    }
    if (this.regionFilter() !== 'all') {
      list = list.filter(p => p.region === this.regionFilter());
    }
    if (this.statusFilter() !== 'all') {
      list = list.filter(p => p.status === this.statusFilter());
    }
    return list;
  });

  ngOnInit() {
    this.agentService.getAllPersonnel().subscribe(data => {
      const mapped = data.map((a: any) => ({
        id: a.id,
        fullName: a.user_full_name || '',
        agentCode: a.agent_code || '',
        region: a.region_name || '',
        role: a.role || 'Agent',
        status: a.status || 'active',
        leads: 0,
        conversions: 0,
        revenue: 0,
        conversionRate: 0,
      }));
      this.personnel.set(mapped);

      // Load stats for each agent
      for (const person of mapped) {
        this.analyticsService.getAgentStats(person.id).subscribe(stats => {
          this.personnel.update(list =>
            list.map(p => p.id === person.id ? {
              ...p,
              leads: stats.totalLeads || 0,
              conversions: stats.conversions || 0,
              revenue: stats.totalRevenue || 0,
              conversionRate: stats.conversionRate || 0,
            } : p)
          );
        });
      }
    });
  }

  onSearch(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  onRoleFilter(event: Event) {
    this.roleFilter.set((event.target as HTMLSelectElement).value);
  }

  onRegionFilter(event: Event) {
    this.regionFilter.set((event.target as HTMLSelectElement).value);
  }

  onStatusFilter(event: Event) {
    this.statusFilter.set((event.target as HTMLSelectElement).value);
  }

  goToDetail(person: any) {
    const role = (person.role || 'agent').toLowerCase();
    this.router.navigateByUrl(`/manager/${role}/${person.id}`);
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  formatCurrency(value: number): string {
    return '$' + (value || 0).toLocaleString();
  }
}
