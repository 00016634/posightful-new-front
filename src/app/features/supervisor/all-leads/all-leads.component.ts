import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageLayoutComponent, PageHeaderComponent } from '../../../shared/layouts';
import {
  CardComponent, CardContentComponent,
  TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent,
  TableHeadComponent, TableCellComponent,
  SelectComponent, DialogComponent, DialogHeaderComponent, DialogTitleComponent,
  DialogFooterComponent, LabelComponent,
} from '../../../shared/ui';
import { LeadService } from '../../../core/services/lead.service';
import { ToastService } from '../../../shared/ui/toast.service';

@Component({
  selector: 'app-all-leads',
  standalone: true,
  imports: [
    FormsModule,
    TitleCasePipe,
    PageLayoutComponent,
    PageHeaderComponent,
    CardComponent,
    CardContentComponent,
    TableComponent,
    TableHeaderComponent,
    TableBodyComponent,
    TableRowComponent,
    TableHeadComponent,
    TableCellComponent,
    SelectComponent,
    DialogComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    DialogFooterComponent,
    LabelComponent,
  ],
  templateUrl: './all-leads.component.html',

  styleUrl: './all-leads.component.css',
})
export class AllLeadsComponent implements OnInit {
  private leadService = inject(LeadService);
  private toastService = inject(ToastService);

  leads = signal<any[]>([]);
  searchTerm = signal('');
  agentFilter = signal('');
  statusFilter = signal('');

  viewDialogOpen = signal(false);
  editDialogOpen = signal(false);
  selectedLead = signal<any | null>(null);
  editForm = signal({ customerName: '', customerPhone: '', status: '', notes: '' });

  uniqueAgents = computed(() => {
    const names = this.leads().map(l => l.agentName);
    return [...new Set(names)];
  });

  filteredLeads = computed(() => {
    let result = this.leads();
    const search = this.searchTerm().toLowerCase();
    if (search) {
      result = result.filter(l =>
        l.customerName.toLowerCase().includes(search) ||
        l.customerPhone.includes(search) ||
        l.id.toLowerCase().includes(search)
      );
    }
    if (this.agentFilter()) {
      result = result.filter(l => l.agentName === this.agentFilter());
    }
    if (this.statusFilter()) {
      result = result.filter(l => l.status === this.statusFilter());
    }
    return result;
  });

  ngOnInit() {
    this.leadService.getLeads().subscribe(data => this.leads.set(data));
  }

  getStatusClasses(status: string): string {
    switch (status) {
      case 'converted': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  viewLead(lead: any) {
    this.selectedLead.set(lead);
    this.viewDialogOpen.set(true);
  }

  openEditDialog(lead: any) {
    this.selectedLead.set(lead);
    this.editForm.set({
      customerName: lead.customerName,
      customerPhone: lead.customerPhone,
      status: lead.status,
      notes: lead.notes,
    });
    this.editDialogOpen.set(true);
  }

  updateEditForm(field: string, value: string) {
    this.editForm.update(f => ({ ...f, [field]: value }));
  }

  saveLead() {
    const lead = this.selectedLead();
    if (!lead) return;
    this.leadService.updateLead(lead.id, this.editForm()).subscribe(() => {
      this.leads.update(leads =>
        leads.map(l => l.id === lead.id ? { ...l, ...this.editForm() } : l)
      );
      this.editDialogOpen.set(false);
      this.toastService.show('Lead Updated', 'Lead has been updated successfully.');
    });
  }

  asInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  asSelectValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  asTextareaValue(event: Event): string {
    return (event.target as HTMLTextAreaElement).value;
  }
}
