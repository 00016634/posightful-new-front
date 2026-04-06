import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LeadConversation } from '../models/conversation.model';

@Injectable({ providedIn: 'root' })
export class ConversationService {
  private apiUrl = `${environment.apiUrl}/api/conversations`;

  constructor(private http: HttpClient) {}

  private extractResults(response: any): LeadConversation[] {
    if (Array.isArray(response)) return response;
    if (response && Array.isArray(response.results)) return response.results;
    return [];
  }

  getConversations(): Observable<LeadConversation[]> {
    return this.http.get<any>(`${this.apiUrl}/?page_size=500`).pipe(
      map(res => this.extractResults(res))
    );
  }

  getConversationByLead(leadId: number): Observable<LeadConversation> {
    return this.http.get<LeadConversation>(`${this.apiUrl}/by-lead/${leadId}/`);
  }

  createConversation(data: { lead: number; channel: string; raw_transcript?: string; audio_file?: File }): Observable<LeadConversation> {
    const formData = new FormData();
    formData.append('lead', String(data.lead));
    formData.append('channel', data.channel);
    if (data.raw_transcript) {
      formData.append('raw_transcript', data.raw_transcript);
    }
    if (data.audio_file) {
      formData.append('audio_file', data.audio_file);
    }
    return this.http.post<LeadConversation>(`${this.apiUrl}/`, formData);
  }

  reAnalyze(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/analyze/`, {});
  }
}
