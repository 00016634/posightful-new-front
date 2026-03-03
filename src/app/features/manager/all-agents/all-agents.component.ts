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
  private router = inject(Router);

  personnel = signal<any[]>([]);
  searchTerm = signal('');
  roleFilter = signal('all');
  regionFilter = signal('all');
  statusFilter = signal('all');

  regions = computed(() => {
    const allRegions = this.personnel().map(p => p.region);
    return [...new Set(allRegions)].sort();
  });

  filteredPersonnel = computed(() => {
    let list = this.personnel();
    const term = this.searchTerm().toLowerCase();
    if (term) {
      list = list.filter(p =>
        p.fullName.toLowerCase().includes(term) ||
        p.agentCode.toLowerCase().includes(term) ||
        p.region.toLowerCase().includes(term)
      );
    }
    if (this.roleFilter() !== 'all') {
      list = list.filter(p => p.role === this.roleFilter());
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
    this.agentService.getAllPersonnel().subscribe(data => this.personnel.set(data));
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
    this.router.navigateByUrl(`/manager/${person.role}/${person.id}`);
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  formatCurrency(value: number): string {
    return '$' + value.toLocaleString();
  }
}
