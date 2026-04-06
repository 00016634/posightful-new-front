import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { PageLayoutComponent, PageHeaderComponent } from '../../../shared/layouts';
import {
  CardComponent, CardContentComponent,
  TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent,
  TableHeadComponent, TableCellComponent,
  DialogComponent, DialogHeaderComponent, DialogTitleComponent, DialogFooterComponent,
  LabelComponent,
} from '../../../shared/ui';
import { LeadService } from '../../../core/services/lead.service';
import { ConversationService } from '../../../core/services/conversation.service';
import { ToastService } from '../../../shared/ui/toast.service';
import { LeadConversation } from '../../../core/models/conversation.model';

// Maps frontend interaction type labels to backend channel values
const INTERACTION_TO_CHANNEL: Record<string, string> = {
  'Phone': 'phone',
  'Email': 'email',
  'In Person': 'in_person',
  'Online Chat': 'online_chat',
  // Also handle lowercase/backend values as-is
  'phone': 'phone',
  'email': 'email',
  'in_person': 'in_person',
  'online_chat': 'online_chat',
};

function isAudioType(interactionType: string): boolean {
  const ch = INTERACTION_TO_CHANNEL[interactionType] || interactionType;
  return ch === 'phone' || ch === 'in_person';
}

@Component({
  selector: 'app-my-leads',
  standalone: true,
  imports: [
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
    DialogComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
    DialogFooterComponent,
    LabelComponent,
  ],
  templateUrl: './my-leads.component.html',
})
export class MyLeadsComponent implements OnInit {
  private leadService = inject(LeadService);
  private conversationService = inject(ConversationService);
  private toastService = inject(ToastService);

  leads = signal<any[]>([]);
  searchTerm = signal('');
  statusFilter = signal('');

  viewDialogOpen = signal(false);
  selectedLead = signal<any | null>(null);

  // Conversation log dialog
  logDialogOpen = signal(false);
  logLead = signal<any | null>(null);
  logTranscript = signal('');
  logAudioFile = signal<File | null>(null);
  logAudioFileName = signal('');
  logSubmitting = signal(false);

  // Whether the lead being logged requires audio
  logIsAudio = computed(() => {
    const lead = this.logLead();
    if (!lead) return false;
    return isAudioType(lead.interactionType || lead.interaction_type || '');
  });

  canSubmitLog = computed(() => {
    if (this.logSubmitting()) return false;
    if (this.logIsAudio()) {
      return !!this.logAudioFile();
    }
    return !!this.logTranscript().trim();
  });

  // Map of leadId → conversation
  conversationMap = signal<Record<number, LeadConversation>>({});

  filteredLeads = computed(() => {
    let result = this.leads();
    const search = this.searchTerm().toLowerCase();
    if (search) {
      result = result.filter(l =>
        (l.customerName || '').toLowerCase().includes(search) ||
        (l.customerPhone || '').includes(search) ||
        String(l.id).toLowerCase().includes(search)
      );
    }
    if (this.statusFilter()) {
      result = result.filter(l => l.status === this.statusFilter());
    }
    return result;
  });

  ngOnInit() {
    this.leadService.getLeads().subscribe(data => {
      const mapped = data.map((l: any) => ({
        ...l,
        customerName: l.customer_name || '',
        customerPhone: l.customer_phone || '',
        interactionType: l.interaction_type || '',
        createdDate: l.created_at ? new Date(l.created_at).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
        }) : '',
        notes: l.notes || '',
      }));
      this.leads.set(mapped);
    });

    this.conversationService.getConversations().subscribe(conversations => {
      const map: Record<number, LeadConversation> = {};
      conversations.forEach(c => map[c.lead] = c);
      this.conversationMap.set(map);
    });
  }

  getStatusClasses(status: string): string {
    switch (status) {
      case 'converted': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'lost': return 'bg-red-100 text-red-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getSentimentClasses(sentiment: string | null): string {
    switch (sentiment) {
      case 'very_positive': return 'bg-green-100 text-green-800';
      case 'positive': return 'bg-emerald-100 text-emerald-800';
      case 'neutral': return 'bg-gray-100 text-gray-800';
      case 'negative': return 'bg-orange-100 text-orange-800';
      case 'very_negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getAnalysisStatusClasses(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  hasConversation(leadId: number): boolean {
    return !!this.conversationMap()[leadId];
  }

  getConversation(leadId: number): LeadConversation | null {
    return this.conversationMap()[leadId] || null;
  }

  renderStars(rating: number | null): string {
    if (!rating) return '\u2014';
    return '\u2605'.repeat(rating) + '\u2606'.repeat(5 - rating);
  }

  formatSentiment(sentiment: string | null): string {
    if (!sentiment) return '\u2014';
    return sentiment.replace(/_/g, ' ');
  }

  viewLead(lead: any) {
    this.selectedLead.set(lead);
    this.viewDialogOpen.set(true);
  }

  openLogDialog(lead: any) {
    this.logLead.set(lead);
    this.logTranscript.set('');
    this.logAudioFile.set(null);
    this.logAudioFileName.set('');
    this.logDialogOpen.set(true);
  }

  onLogTranscriptChange(event: Event) {
    this.logTranscript.set((event.target as HTMLTextAreaElement).value);
  }

  onAudioFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.logAudioFile.set(input.files[0]);
      this.logAudioFileName.set(input.files[0].name);
    }
  }

  submitLog() {
    const lead = this.logLead();
    if (!lead) return;

    if (this.logIsAudio() && !this.logAudioFile()) return;
    if (!this.logIsAudio() && !this.logTranscript().trim()) return;

    this.logSubmitting.set(true);

    const channel = INTERACTION_TO_CHANNEL[lead.interactionType || lead.interaction_type] || 'email';
    const payload: { lead: number; channel: string; raw_transcript?: string; audio_file?: File } = {
      lead: lead.id,
      channel,
    };

    if (this.logIsAudio()) {
      payload.audio_file = this.logAudioFile()!;
    } else {
      payload.raw_transcript = this.logTranscript();
    }

    this.conversationService.createConversation(payload).subscribe({
      next: (conversation) => {
        this.conversationMap.update(map => ({ ...map, [lead.id]: conversation as LeadConversation }));
        this.logDialogOpen.set(false);
        this.logSubmitting.set(false);
        this.toastService.show('Conversation Log Added', 'AI analysis has been triggered and will complete shortly.');
      },
      error: () => {
        this.logSubmitting.set(false);
        this.toastService.show('Error', 'Failed to create conversation log. Please try again.', 'destructive');
      },
    });
  }

  onSearch(event: Event) {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  onStatusFilter(event: Event) {
    this.statusFilter.set((event.target as HTMLSelectElement).value);
  }
}
