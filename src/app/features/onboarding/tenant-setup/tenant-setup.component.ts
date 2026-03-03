import { Component, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PageLayoutComponent } from '../../../shared/layouts/page-layout.component';
import { PageHeaderComponent } from '../../../shared/layouts/page-header.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent, CardFooterComponent } from '../../../shared/ui/card.component';
import { LabelComponent } from '../../../shared/ui/label.component';
import { InputComponent } from '../../../shared/ui/input.component';
import { SelectComponent } from '../../../shared/ui/select.component';
import { ButtonComponent } from '../../../shared/ui/button.component';
import { ProgressComponent } from '../../../shared/ui/progress.component';
import { OnboardingService, OnboardingPayload } from '../../../core/services/onboarding.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-tenant-setup',
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
    CardFooterComponent,
    LabelComponent,
    InputComponent,
    SelectComponent,
    ButtonComponent,
    ProgressComponent,
  ],
  templateUrl: './tenant-setup.component.html',

  styleUrl: './tenant-setup.component.css',
})
export class TenantSetupComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private onboardingService = inject(OnboardingService);
  private authService = inject(AuthService);

  currentStep = signal(1);
  progressValue = computed(() => this.currentStep() === 1 ? 50 : 100);
  submitting = signal(false);
  errorMessage = signal('');

  companySizes = ['1-10', '11-50', '51-200', '201-500', '500+'];
  industries = ['Insurance', 'Real Estate', 'Financial Services', 'Retail', 'Other'];

  companyForm = this.fb.group({
    companyName: ['', [Validators.required]],
    companySize: ['', [Validators.required]],
    industry: ['', [Validators.required]],
  });

  adminForm = this.fb.group({
    adminName: ['', [Validators.required]],
    adminEmail: ['', [Validators.required, Validators.email]],
    adminPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor() {
    const plan = this.onboardingService.selectedPlan();
    const payment = this.onboardingService.paymentData();
    if (!plan || !payment) {
      this.router.navigateByUrl('/purchase');
    }
  }

  nextStep() {
    if (this.companyForm.valid) {
      this.currentStep.set(2);
    } else {
      this.companyForm.markAllAsTouched();
    }
  }

  previousStep() {
    this.currentStep.set(1);
  }

  finish() {
    if (this.adminForm.invalid) {
      this.adminForm.markAllAsTouched();
      return;
    }

    const plan = this.onboardingService.selectedPlan();
    const payment = this.onboardingService.paymentData();
    if (!plan || !payment) {
      this.router.navigateByUrl('/purchase');
      return;
    }

    const company = this.companyForm.value;
    const admin = this.adminForm.value;

    const payload: OnboardingPayload = {
      plan_id: plan.id,
      card_number: payment.cardNumber,
      cardholder_name: payment.cardholderName,
      expiry: payment.expiry,
      cvv: payment.cvv,
      billing_email: payment.billingEmail,
      company_name: company.companyName!,
      company_size: company.companySize!,
      industry: company.industry!,
      admin_full_name: admin.adminName!,
      admin_email: admin.adminEmail!,
      admin_password: admin.adminPassword!,
    };

    this.submitting.set(true);
    this.errorMessage.set('');

    this.onboardingService.submitOnboarding(payload).subscribe({
      next: (response) => {
        this.authService.setSession(response);
        this.onboardingService.clear();
        this.router.navigateByUrl('/admin');
      },
      error: (err) => {
        this.submitting.set(false);
        const detail = err.error;
        if (typeof detail === 'object' && detail !== null) {
          const messages = Object.values(detail).flat();
          this.errorMessage.set(messages.join(' '));
        } else {
          this.errorMessage.set('Something went wrong. Please try again.');
        }
      },
    });
  }
}
