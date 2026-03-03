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

  ngOnInit() {
    this.form = this.fb.group({
      name: ['Default Attribution Policy', Validators.required],
      mode: ['LAST_TOUCH'],
      windowValue: [30, Validators.required],
      windowUnit: ['days'],
      effectiveFrom: ['2026-01-01', Validators.required],
    });

    this.bonusService.getAttributionPolicy().subscribe(policy => {
      this.form.patchValue({
        name: policy.name,
        mode: policy.mode,
        windowValue: policy.windowValue,
        windowUnit: policy.windowUnit,
        effectiveFrom: policy.effectiveFrom,
      });
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.bonusService.updateAttributionPolicy(this.form.value).subscribe(() => {
      this.toastService.show('Policy Updated', 'Attribution window updated successfully');
    });
  }
}
