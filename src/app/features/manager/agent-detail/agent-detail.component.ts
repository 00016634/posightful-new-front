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
import { LeadService } from '../../../core/services/lead.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
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
  private leadService = inject(LeadService);
  private analyticsService = inject(AnalyticsService);

  isSupervisor = false;

  agent = signal({
    fullName: '', agentCode: '', role: '', supervisor: '',
    region: '', phone: '', hireDate: '',
  });

  stats = signal({
    totalLeads: 0, conversions: 0, conversionRate: 0,
    totalRevenue: 0, avgTicket: 0, pendingLeads: 0, bonusEarned: 0,
  });

  perfLabels: string[] = [];
  perfDatasets: any[] = [];

  attachedAgents: any[] = [];
  recentLeads: any[] = [];

  ngOnInit() {
    const role = this.route.snapshot.paramMap.get('role') || 'agent';
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isSupervisor = role === 'supervisor';

    // Load agent profile
    this.agentService.getAgentById(id).subscribe(data => {
      if (data) {
        this.agent.set({
          fullName: data.user_full_name || '',
          agentCode: data.agent_code || '',
          role: data.role || (this.isSupervisor ? 'Supervisor' : 'Agent'),
          supervisor: data.parent_name || '',
          region: data.region_name || '',
          phone: data.user_phone || '',
          hireDate: data.hired_at || '',
        });

        // If supervisor, load attached agents
        if (this.isSupervisor) {
          this.agentService.getAllPersonnel().subscribe(agents => {
            this.attachedAgents = agents
              .filter((a: any) => a.parent === id)
              .map((a: any) => ({
                fullName: a.user_full_name || '',
                agentCode: a.agent_code || '',
                leads: 0,
                conversions: 0,
                revenue: 0,
                conversionRate: 0,
              }));

            // Load KPI stats for each attached agent
            for (const agent of this.attachedAgents) {
              const agentObj = agents.find((a: any) => a.agent_code === agent.agentCode);
              if (agentObj) {
                this.analyticsService.getAgentStats(agentObj.id).subscribe(stats => {
                  agent.leads = stats.totalLeads || 0;
                  agent.conversions = stats.conversions || 0;
                  agent.revenue = stats.totalRevenue || 0;
                  agent.conversionRate = stats.conversionRate || 0;
                });
              }
            }
          });
        }
      }
    });

    // Load real stats from analytics
    this.analyticsService.getAgentStats(id).subscribe(stats => {
      this.stats.set({
        totalLeads: stats.totalLeads || 0,
        conversions: stats.conversions || 0,
        conversionRate: stats.conversionRate || 0,
        totalRevenue: stats.totalRevenue || 0,
        avgTicket: stats.avgTicket || 0,
        pendingLeads: stats.pendingLeads || 0,
        bonusEarned: stats.bonusEarned || 0,
      });
    });

    // Load performance chart data filtered by this agent
    this.analyticsService.getPerformanceChart(id).subscribe(chart => {
      this.perfLabels = chart.labels || [];
      this.perfDatasets = chart.datasets || [];
    });

    // Load recent leads for this agent
    this.leadService.getLeads().subscribe(leads => {
      this.recentLeads = leads
        .filter((l: any) => l.agent === id)
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10)
        .map((l: any) => ({
          id: `LD-${l.id}`,
          customer: l.customer_name || '',
          status: l.status || 'new',
          amount: l.sale_amount || null,
          date: l.created_at || '',
        }));
    });
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('');
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'converted': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'lost': return 'bg-red-100 text-red-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  formatNumber(value: number): string {
    return value.toLocaleString();
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
