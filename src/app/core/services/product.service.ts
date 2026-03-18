import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private productsUrl = `${environment.apiUrl}/api/tenancy/products`;
  private pipelinesUrl = `${environment.apiUrl}/api/leads/pipelines`;
  private stagesUrl = `${environment.apiUrl}/api/leads/stages`;
  private salesUrl = `${environment.apiUrl}/api/conversions/sales`;

  constructor(private http: HttpClient) {}

  private extractResults(res: any): any[] {
    return Array.isArray(res) ? res : res.results ?? [];
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any>(`${this.productsUrl}/`).pipe(
      map(res => this.extractResults(res))
    );
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.productsUrl}/${id}/`);
  }

  createProduct(product: any): Observable<any> {
    return this.http.post<any>(`${this.productsUrl}/`, product);
  }

  updateProduct(id: number, data: any): Observable<any> {
    return this.http.patch<any>(`${this.productsUrl}/${id}/`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.productsUrl}/${id}/`);
  }

  getProductFunnels(): Observable<any[]> {
    return forkJoin({
      pipelines: this.http.get<any>(`${this.pipelinesUrl}/?page_size=100`).pipe(map(r => this.extractResults(r))),
      stages: this.http.get<any>(`${this.stagesUrl}/?page_size=500`).pipe(map(r => this.extractResults(r))),
    }).pipe(
      map(({ pipelines, stages }) => {
        // Group stages by pipeline ID
        const stagesByPipeline = new Map<number, any[]>();
        for (const s of stages) {
          const list = stagesByPipeline.get(s.pipeline) || [];
          list.push({
            id: s.id,
            name: s.name,
            order: s.stage_order,
            isTerminal: s.is_terminal,
            description: s.is_terminal ? 'Terminal stage' : '',
          });
          stagesByPipeline.set(s.pipeline, list);
        }
        // Build funnel per pipeline
        return pipelines.map((p: any) => ({
          productId: p.product,
          pipelineId: p.id,
          productName: p.product_name,
          stages: (stagesByPipeline.get(p.id) || []).sort((a: any, b: any) => a.order - b.order),
        }));
      })
    );
  }

  getConversions(): Observable<any[]> {
    return this.http.get<any>(`${this.salesUrl}/`).pipe(
      map(res => this.extractResults(res))
    );
  }
}
