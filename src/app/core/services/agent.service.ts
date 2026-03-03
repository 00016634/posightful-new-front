import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AgentService {
  private apiUrl = `${environment.apiUrl}/api/tenancy/agents`;
  private authUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  getAgents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`).pipe(
      map(agents => agents.filter(a => !a.parent || a.subordinates === undefined))
    );
  }

  getSupervisors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`).pipe(
      map(agents => agents.filter(a => a.parent === null))
    );
  }

  getAllPersonnel(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
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
