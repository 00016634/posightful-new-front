import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { PageLayoutComponent, PageHeaderComponent } from '../../../shared/layouts';
import {
  CardComponent, CardContentComponent,
  TableComponent, TableHeaderComponent, TableBodyComponent, TableRowComponent,
  TableHeadComponent, TableCellComponent,
  SelectComponent, DialogComponent, DialogHeaderComponent, DialogTitleComponent,
} from '../../../shared/ui';
import { ConversationService } from '../../../core/services/conversation.service';
import { LeadConversation } from '../../../core/models/conversation.model';

@Component({
  selector: 'app-conversation-logs',
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
    SelectComponent,
    DialogComponent,
    DialogHeaderComponent,
    DialogTitleComponent,
  ],
  templateUrl: './conversation-logs.component.html',
})
export class ConversationLogsComponent implements OnInit {
  private conversationService = inject(ConversationService);

  conversations = signal<LeadConversation[]>([]);
  searchTerm = signal('');
  sentimentFilter = signal('');
  channelFilter = signal('');
  ratingFilter = signal('');

  viewDialogOpen = signal(false);
  selectedConversation = signal<LeadConversation | null>(null);

  filteredConversations = computed(() => {
    let result = this.conversations();
    const search = this.searchTerm().toLowerCase();
    if (search) {
      result = result.filter(c =>
        (c.agent_name || '').toLowerCase().includes(search) ||
        (c.lead_customer_name || '').toLowerCase().includes(search) ||
        (c.conversation_topic || '').toLowerCase().includes(search)
      );
    }
    if (this.sentimentFilter()) {
      result = result.filter(c => c.customer_sentiment === this.sentimentFilter());
    }
    if (this.channelFilter()) {
      result = result.filter(c => c.channel === this.channelFilter());
    }
    if (this.ratingFilter()) {
      result = result.filter(c => c.rating === Number(this.ratingFilter()));
    }
    return result;
  });

  ngOnInit() {
    this.conversationService.getConversations().subscribe(data => {
      this.conversations.set(data);
    });
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

  renderStars(rating: number | null): string {
    if (!rating) return '\u2014';
    return '\u2605'.repeat(rating) + '\u2606'.repeat(5 - rating);
  }

  formatSentiment(sentiment: string | null): string {
    if (!sentiment) return '\u2014';
    return sentiment.replace(/_/g, ' ');
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  }

  formatChannel(channel: string): string {
    return channel.replace(/_/g, ' ');
  }

  viewConversation(conv: LeadConversation) {
    this.selectedConversation.set(conv);
    this.viewDialogOpen.set(true);
  }

  asInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  asSelectValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }
}
