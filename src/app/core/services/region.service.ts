import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Region {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
}

@Injectable({ providedIn: 'root' })
export class RegionService {
  private url = `${environment.apiUrl}/api/tenancy/regions`;

  constructor(private http: HttpClient) {}

  getRegions(): Observable<Region[]> {
    return this.http.get<any>(`${this.url}/`).pipe(
      map(res => Array.isArray(res) ? res : res.results ?? [])
    );
  }

  createRegion(data: { name: string; code?: string }): Observable<Region> {
    return this.http.post<Region>(`${this.url}/`, data);
  }

  updateRegion(id: number, data: Partial<Region>): Observable<Region> {
    return this.http.patch<Region>(`${this.url}/${id}/`, data);
  }

  deleteRegion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}/`);
  }
}
