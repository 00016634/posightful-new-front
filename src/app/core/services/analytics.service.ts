import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/api/analytics`;

  constructor(private http: HttpClient) {}

  getAgentMetrics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/agent-dashboard/`);
  }

  getSupervisorMetrics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/supervisor-dashboard/`);
  }

  getManagerMetrics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/manager-dashboard/`);
  }

  getConversionChart(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/conversion-chart/`);
  }

  getRevenueTrend(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/revenue-trend/`);
  }

  getPersonnelChart(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/personnel-chart/`);
  }

  getConversionRateTrend(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/conversion-rate-trend/`);
  }

  getSupervisorPerformance(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/supervisor-performance/`);
  }

  getTopAgents(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-agents/`);
  }

  getPerformanceChart(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/performance-chart/`);
  }
}
