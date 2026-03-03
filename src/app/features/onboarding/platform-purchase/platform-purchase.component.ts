import { Component, signal, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent, CardFooterComponent } from '../../../shared/ui/card.component';
import { ButtonComponent } from '../../../shared/ui/button.component';
import { BadgeComponent } from '../../../shared/ui/badge.component';
import { OnboardingService } from '../../../core/services/onboarding.service';
import { PricingPlan } from '../../../core/models/tenant.model';

interface Plan extends PricingPlan {
  popular: boolean;
}

@Component({
  selector: 'app-platform-purchase',
  standalone: true,
  imports: [
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    CardFooterComponent,
    ButtonComponent,
    BadgeComponent,
  ],
  templateUrl: './platform-purchase.component.html',

  styleUrl: './platform-purchase.component.css',
})
export class PlatformPurchaseComponent implements OnInit {
  private router = inject(Router);
  private onboardingService = inject(OnboardingService);

  plans = signal<Plan[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.onboardingService.getPlans().subscribe({
      next: (plans) => {
        this.plans.set(
          plans.map(p => ({
            ...p,
            popular: p.name === 'Professional',
          }))
        );
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  selectPlan(plan: Plan) {
    this.onboardingService.selectedPlan.set(plan);
    this.router.navigateByUrl('/purchase/payment');
  }
}
