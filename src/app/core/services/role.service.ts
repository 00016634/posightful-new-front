import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Role } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private roles$?: Observable<Role[]>;

  constructor(private http: HttpClient) {}

  getRoles(): Observable<Role[]> {
    if (!this.roles$) {
      this.roles$ = this.http
        .get<Role[]>(`${this.apiUrl}/roles/`)
        .pipe(shareReplay(1));
    }
    return this.roles$;
  }
}
