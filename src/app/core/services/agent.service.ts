import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AgentService {
  private apiUrl = `${environment.apiUrl}/api/tenancy/agents`;
  private authUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  private extractResults(response: any): any[] {
    // Handle both paginated { results: [] } and plain array responses
    if (Array.isArray(response)) return response;
    if (response && Array.isArray(response.results)) return response.results;
    return [];
  }

  getAgents(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/?page_size=500`).pipe(
      map(res => this.extractResults(res).filter(a => a.parent !== null))
    );
  }

  getSupervisors(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/?page_size=500`).pipe(
      map(res => this.extractResults(res).filter(a => a.parent === null))
    );
  }

  getAllPersonnel(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/?page_size=500`).pipe(
      map(res => this.extractResults(res))
    );
  }

  getAgentById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/`);
  }

  getAgentProfile(): Observable<any> {
    return this.http.get<any>(`${this.authUrl}/profile/`).pipe(
      map(user => ({
        fullName: user.full_name || user.username,
        agentCode: user.agent_code || '',
        phone: user.phone_number || '',
        region: user.region || '',
        supervisor: user.supervisor || '',
        hireDate: user.created_at || '',
      }))
    );
  }

  getSupervisorProfile(): Observable<any> {
    return this.http.get<any>(`${this.authUrl}/profile/`).pipe(
      map(user => ({
        fullName: user.full_name || user.username,
        supervisorCode: user.agent_code || '',
        phone: user.phone_number || '',
        region: user.region || '',
        manager: user.supervisor || '',
        hireDate: user.created_at || '',
      }))
    );
  }
}
