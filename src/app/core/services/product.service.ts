import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private productsUrl = `${environment.apiUrl}/api/tenancy/products`;
  private pipelinesUrl = `${environment.apiUrl}/api/leads/pipelines`;
  private stagesUrl = `${environment.apiUrl}/api/leads/stages`;
  private salesUrl = `${environment.apiUrl}/api/conversions/sales`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    return this.http.get<any>(`${this.productsUrl}/`).pipe(
      map(res => Array.isArray(res) ? res : res.results ?? [])
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
    return this.http.get<any>(`${this.pipelinesUrl}/`).pipe(
      map(res => Array.isArray(res) ? res : res.results ?? []),
      map(pipelines => pipelines.map((p: any) => ({
        productId: p.product,
        productName: p.product_name,
        stages: [],
      })))
    );
  }

  getConversions(): Observable<any[]> {
    return this.http.get<any>(`${this.salesUrl}/`).pipe(
      map(res => Array.isArray(res) ? res : res.results ?? [])
    );
  }
}
