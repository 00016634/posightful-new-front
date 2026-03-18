import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private authUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<PaginatedResponse<any>>(`${this.authUrl}/users/?page_size=200`).pipe(
      map(response => response.results.map(user => ({
        id: user.id,
        fullName: user.full_name || user.username,
        email: user.email || '',
        phone: user.phone_number || '',
        role: (user.role === 'finance' ? 'accountant' : user.role) || 'agent',
        region: user.region || '',
        status: user.is_active ? 'active' : 'inactive',
        userCode: user.agentCode || user.username,
        supervisor: user.supervisor || '',
      })))
    );
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.authUrl}/users/${id}/`).pipe(
      map(user => ({
        ...user,
        fullName: user.full_name || user.username,
        phone: user.phone_number || '',
        role: (user.role === 'finance' ? 'accountant' : user.role) || 'agent',
        region: user.region || '',
        status: user.is_active ? 'active' : 'inactive',
        userCode: user.agentCode || user.username,
      }))
    );
  }

  createUser(user: any): Observable<any> {
    return this.http.post<any>(`${this.authUrl}/users/`, user);
  }

  updateUser(id: number, data: any): Observable<any> {
    return this.http.patch<any>(`${this.authUrl}/users/${id}/`, data);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.authUrl}/users/${id}/`);
  }

  getAdminStats(): Observable<any> {
    return this.http.get<any>(`${this.authUrl}/admin-stats/`);
  }

  getRecentActivity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.authUrl}/recent-activity/`);
  }

  getAccountantData(): Observable<any> {
    return this.http.get<any>(`${this.authUrl}/accountant-data/`);
  }
}
