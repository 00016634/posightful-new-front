import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PricingPlan } from '../models/tenant.model';
import { AuthResponse } from '../models/user.model';

export interface PaymentData {
  cardNumber: string;
  cardholderName: string;
  expiry: string;
  cvv: string;
  billingEmail: string;
}

export interface OnboardingPayload {
  plan_id: number;
  card_number: string;
  cardholder_name: string;
  expiry: string;
  cvv: string;
  billing_email: string;
  company_name: string;
  company_size: string;
  industry: string;
  admin_full_name: string;
  admin_email: string;
  admin_password: string;
}

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  private apiUrl = `${environment.apiUrl}/api/tenancy`;

  selectedPlan = signal<PricingPlan | null>(null);
  paymentData = signal<PaymentData | null>(null);

  constructor(private http: HttpClient) {}

  getPlans(): Observable<PricingPlan[]> {
    return this.http.get<PricingPlan[]>(`${this.apiUrl}/plans/`);
  }

  submitOnboarding(payload: OnboardingPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/onboarding/`, payload);
  }

  clear(): void {
    this.selectedPlan.set(null);
    this.paymentData.set(null);
  }
}
