import { Component, signal, inject, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PageLayoutComponent } from '../../../shared/layouts/page-layout.component';
import { PageHeaderComponent } from '../../../shared/layouts/page-header.component';
import {
  CardComponent,
  CardHeaderComponent,
  CardTitleComponent,
  CardDescriptionComponent,
  CardContentComponent,
} from '../../../shared/ui/card.component';
import { LabelComponent } from '../../../shared/ui/label.component';
import { InputComponent } from '../../../shared/ui/input.component';
import { SelectComponent } from '../../../shared/ui/select.component';
import { ButtonComponent } from '../../../shared/ui/button.component';
import { OnboardingService } from '../../../core/services/onboarding.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageLayoutComponent,
    PageHeaderComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    LabelComponent,
    InputComponent,
    SelectComponent,
    ButtonComponent,
  ],
  templateUrl: './payment.component.html',

  styleUrl: './payment.component.css',
})
export class PaymentComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private onboardingService = inject(OnboardingService);

  processing = signal(false);

  planName = computed(() => this.onboardingService.selectedPlan()?.name ?? 'Professional');
  planPrice = computed(() => this.onboardingService.selectedPlan()?.price ?? 799);

  currentYear = new Date().getFullYear();
  years = Array.from({ length: 15 }, (_, i) => this.currentYear + i);
  months = [
    { value: '01', label: '01 - January' },
    { value: '02', label: '02 - February' },
    { value: '03', label: '03 - March' },
    { value: '04', label: '04 - April' },
    { value: '05', label: '05 - May' },
    { value: '06', label: '06 - June' },
    { value: '07', label: '07 - July' },
    { value: '08', label: '08 - August' },
    { value: '09', label: '09 - September' },
    { value: '10', label: '10 - October' },
    { value: '11', label: '11 - November' },
    { value: '12', label: '12 - December' },
  ];

  paymentForm = this.fb.group({
    cardNumber: ['', [Validators.required, Validators.minLength(13)]],
    cardholderName: ['', [Validators.required]],
    expiryMonth: ['', [Validators.required]],
    expiryYear: ['', [Validators.required]],
    cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    billingEmail: ['', [Validators.required, Validators.email]],
  });

  ngOnInit() {
    if (!this.onboardingService.selectedPlan()) {
      this.router.navigateByUrl('/purchase');
    }
  }

  goBack() {
    this.router.navigateByUrl('/purchase');
  }

  onSubmit() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const form = this.paymentForm.value;
    this.onboardingService.paymentData.set({
      cardNumber: form.cardNumber!,
      cardholderName: form.cardholderName!,
      expiry: `${form.expiryMonth}/${String(form.expiryYear).slice(-2)}`,
      cvv: form.cvv!,
      billingEmail: form.billingEmail!,
    });

    this.router.navigateByUrl('/purchase/setup');
  }
}
