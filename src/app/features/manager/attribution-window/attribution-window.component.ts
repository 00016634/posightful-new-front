import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageLayoutComponent } from '../../../shared/layouts/page-layout.component';
import {
  CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
  ButtonComponent, LabelComponent,
} from '../../../shared/ui';
import { BonusService } from '../../../core/services/bonus.service';
import { ToastService } from '../../../shared/ui/toast.service';

@Component({
  selector: 'app-attribution-window',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageLayoutComponent,
    CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
    ButtonComponent, LabelComponent,
  ],
  templateUrl: './attribution-window.component.html',

  styleUrl: './attribution-window.component.css',
})
export class AttributionWindowComponent implements OnInit {
  router = inject(Router);
  private fb = inject(FormBuilder);
  private bonusService = inject(BonusService);
  private toastService = inject(ToastService);

  form!: FormGroup;
  private policyId: number | null = null;
  saving = signal(false);

  ngOnInit() {
    this.form = this.fb.group({
      name: ['Default Attribution Policy', Validators.required],
      mode: ['LAST_TOUCH'],
      windowValue: [30, Validators.required],
      windowUnit: ['days'],
      effectiveFrom: ['2026-01-01', Validators.required],
    });

    this.bonusService.getAttributionPolicy().subscribe(policy => {
      if (!policy) return;
      this.policyId = policy.id;
      // Parse window_interval (e.g. "30 00:00:00" = 30 days)
      const { value, unit } = this.parseInterval(policy.window_interval);
      // Parse effective_from date
      const effDate = policy.effective_from ? policy.effective_from.split(' ')[0] : '';
      this.form.patchValue({
        name: policy.name,
        mode: policy.mode,
        windowValue: value,
        windowUnit: unit,
        effectiveFrom: effDate,
      });
    });
  }

  private parseInterval(interval: string): { value: number; unit: string } {
    if (!interval) return { value: 30, unit: 'days' };
    // Format: "D HH:MM:SS" or "HH:MM:SS"
    const parts = interval.split(' ');
    if (parts.length === 2) {
      const days = parseInt(parts[0], 10);
      if (days >= 7 && days % 7 === 0) return { value: days / 7, unit: 'weeks' };
      if (days >= 30 && days % 30 === 0) return { value: days / 30, unit: 'months' };
      return { value: days, unit: 'days' };
    }
    // hours only
    const timeParts = parts[0].split(':');
    return { value: parseInt(timeParts[0], 10), unit: 'hours' };
  }

  private buildInterval(): string {
    const val = this.form.get('windowValue')?.value || 30;
    const unit = this.form.get('windowUnit')?.value || 'days';
    let days = val;
    if (unit === 'hours') return `${val}:00:00`;
    if (unit === 'weeks') days = val * 7;
    if (unit === 'months') days = val * 30;
    return `${days} 00:00:00`;
  }

  onSubmit() {
    if (this.form.invalid || !this.policyId) return;
    this.saving.set(true);
    const payload = {
      id: this.policyId,
      name: this.form.get('name')?.value,
      mode: this.form.get('mode')?.value,
      window_interval: this.buildInterval(),
      effective_from: this.form.get('effectiveFrom')?.value,
    };
    this.bonusService.updateAttributionPolicy(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.toastService.show('Policy Updated', 'Attribution window updated successfully');
      },
      error: () => {
        this.saving.set(false);
        this.toastService.show('Error', 'Failed to update policy');
      },
    });
  }
}
