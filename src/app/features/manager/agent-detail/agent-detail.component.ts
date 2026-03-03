import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageLayoutComponent } from '../../../shared/layouts/page-layout.component';
import { ConversionChartComponent } from '../../../shared/components/conversion-chart.component';
import {
  CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
  ButtonComponent, AvatarComponent, BadgeComponent,
  TableComponent, TableHeaderComponent, TableBodyComponent,
  TableRowComponent, TableHeadComponent, TableCellComponent,
} from '../../../shared/ui';
import { AgentService } from '../../../core/services/agent.service';

@Component({
  selector: 'app-agent-detail',
  standalone: true,
  imports: [
    PageLayoutComponent, ConversionChartComponent,
    CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
    ButtonComponent, AvatarComponent, BadgeComponent,
    TableComponent, TableHeaderComponent, TableBodyComponent,
    TableRowComponent, TableHeadComponent, TableCellComponent,
  ],
  templateUrl: './agent-detail.component.html',

  styleUrl: './agent-detail.component.css',
})
export class AgentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  private agentService = inject(AgentService);

  isSupervisor = false;

  agent = signal({
    fullName: '', agentCode: '', role: '', supervisor: '',
    region: '', phone: '', hireDate: '',
  });

  stats = signal({
    totalLeads: 0, conversions: 0, conversionRate: 0,
    totalRevenue: 0, avgTicket: 0, pendingLeads: 0, bonusEarned: 0,
  });

  perfLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  perfDatasets = [
    { name: 'Leads', data: [12, 15, 18, 20], color: '#3b82f6' },
    { name: 'Conversions', data: [4, 6, 7, 8], color: '#10b981' },
  ];

  attachedAgents = [
    { fullName: 'John Smith', agentCode: 'AG-001', leads: 45, conversions: 18, revenue: 27300, conversionRate: 40 },
    { fullName: 'Sarah Johnson', agentCode: 'AG-003', leads: 38, conversions: 15, revenue: 22750, conversionRate: 39.5 },
    { fullName: 'Michael Brown', agentCode: 'AG-005', leads: 42, conversions: 16, revenue: 24800, conversionRate: 38.1 },
    { fullName: 'Emily Davis', agentCode: 'AG-007', leads: 35, conversions: 14, revenue: 21200, conversionRate: 40 },
  ];

  recentLeads = [
    { id: 'LD-10023', customer: 'Robert Davis', status: 'converted', amount: 1200, date: 'Jan 18, 2026' },
    { id: 'LD-10022', customer: 'Emily Wilson', status: 'pending', amount: null, date: 'Jan 18, 2026' },
    { id: 'LD-10021', customer: 'James Anderson', status: 'lost', amount: null, date: 'Jan 17, 2026' },
    { id: 'LD-10020', customer: 'Patricia Martinez', status: 'converted', amount: 850, date: 'Jan 17, 2026' },
  ];

  ngOnInit() {
    const role = this.route.snapshot.paramMap.get('role') || 'agent';
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isSupervisor = role === 'supervisor';

    this.agentService.getAgentById(id).subscribe(data => {
      if (data) {
        this.agent.set({
          fullName: data.fullName,
          agentCode: data.agentCode,
          role: data.role,
          supervisor: data.supervisor,
          region: data.region,
          phone: data.phone,
          hireDate: data.hireDate,
        });
        this.stats.set({
          totalLeads: data.leads,
          conversions: data.conversions,
          conversionRate: data.leads ? Math.round((data.conversions / data.leads) * 100) : 0,
          totalRevenue: data.revenue,
          avgTicket: data.conversions ? Math.round(data.revenue / data.conversions) : 0,
          pendingLeads: Math.round(data.leads * 0.25),
          bonusEarned: Math.round(data.revenue * 0.1),
        });
      }
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('');
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'converted': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatNumber(value: number): string {
    return value.toLocaleString();
  }
}
