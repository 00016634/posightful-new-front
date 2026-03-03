import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BonusService {
  private apiUrl = `${environment.apiUrl}/api/bonuses`;

  constructor(private http: HttpClient) {}

  getBonusRules(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rules/`);
  }

  getMonthlyBonuses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/monthly/`);
  }

  getMonthlyDetail(month: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/monthly/${month}/`);
  }

  getAttributionPolicy(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/policies/`);
  }

  updateRule(id: number, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/rules/${id}/`, data);
  }

  updateAttributionPolicy(data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/policies/${data.id}/`, data);
  }
}
