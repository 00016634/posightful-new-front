import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageLayoutComponent } from '../../../shared/layouts/page-layout.component';
import {
  CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
  ButtonComponent, LabelComponent, SwitchComponent,
} from '../../../shared/ui';
import { ToastService } from '../../../shared/ui/toast.service';

@Component({
  selector: 'app-bonus-rule-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageLayoutComponent,
    CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
    ButtonComponent, LabelComponent, SwitchComponent,
  ],
  templateUrl: './bonus-rule-form.component.html',

  styleUrl: './bonus-rule-form.component.css',
})
export class BonusRuleFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  isEditMode = false;
  form!: FormGroup;

  ngOnInit() {
    const ruleId = this.route.snapshot.paramMap.get('ruleId');
    this.isEditMode = !!ruleId && ruleId !== 'new';

    this.form = this.fb.group({
      name: ['', Validators.required],
      isActive: [true],
      dimension: ['SELL_AMOUNT'],
      operator: ['GTE'],
      conditionValue: [''],
      payoutType: ['fixed'],
      payoutValue: [0, Validators.required],
      capAmount: [null],
      priority: [100, Validators.required],
      effectiveFrom: [new Date().toISOString().split('T')[0], Validators.required],
      effectiveTo: [''],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.toastService.show('Validation Error', 'Please fill in all required fields.', 'destructive');
      return;
    }

    if (this.isEditMode) {
      this.toastService.show('Rule Updated', 'Rule updated successfully');
    } else {
      this.toastService.show('Rule Created', 'Rule created successfully');
    }
    this.router.navigateByUrl('/manager/bonus-management/rules');
  }
}
