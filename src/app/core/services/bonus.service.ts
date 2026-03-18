import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BonusService {
  private apiUrl = `${environment.apiUrl}/api/bonuses`;

  constructor(private http: HttpClient) {}

  private extractResults(response: any): any[] {
    if (Array.isArray(response)) return response;
    if (response && Array.isArray(response.results)) return response.results;
    return [];
  }

  getBonusRules(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/rules/?page_size=500`).pipe(
      map(res => this.extractResults(res))
    );
  }

  getMonthlyBonuses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/monthly/`);
  }

  getMonthlyDetail(month: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/monthly/${month}/`);
  }

  getMonthlyAudit(month: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/monthly/${month}/audit/`);
  }

  getAttributionPolicy(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/policies/?page_size=500`).pipe(
      map(res => {
        const results = this.extractResults(res);
        return results.length > 0 ? results[0] : null;
      })
    );
  }

  updateRule(id: number, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/rules/${id}/`, data);
  }

  updateAttributionPolicy(data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/policies/${data.id}/`, data);
  }
}
