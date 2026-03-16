import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LeadService {
  private apiUrl = `${environment.apiUrl}/api/leads/leads`;

  constructor(private http: HttpClient) {}

  private extractResults(response: any): any[] {
    if (Array.isArray(response)) return response;
    if (response && Array.isArray(response.results)) return response.results;
    return [];
  }

  getLeads(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/?page_size=500`).pipe(
      map(res => this.extractResults(res))
    );
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
