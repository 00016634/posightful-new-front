import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LeadService {
  private apiUrl = `${environment.apiUrl}/api/leads/leads`;

  constructor(private http: HttpClient) {}

  getLeads(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  getLeadById(id: string | number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/`);
  }

  createLead(lead: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/`, lead);
  }

  updateLead(id: string | number, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/`, data);
  }

  deleteLead(id: string | number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}/`);
  }
}
