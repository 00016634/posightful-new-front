import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private authUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.authUrl}/users/`);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.authUrl}/users/${id}/`);
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
