import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageLayoutComponent } from '../../../shared/layouts/page-layout.component';
import {
  CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
  ButtonComponent, LabelComponent, SwitchComponent,
} from '../../../shared/ui';
import { BonusService } from '../../../core/services/bonus.service';
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
  private bonusService = inject(BonusService);
  private toastService = inject(ToastService);

  isEditMode = false;
  ruleId: number | null = null;
  submitting = false;
  form!: FormGroup;

  ngOnInit() {
    const ruleIdParam = this.route.snapshot.paramMap.get('ruleId');
    this.isEditMode = !!ruleIdParam && ruleIdParam !== 'new';
    this.ruleId = this.isEditMode ? Number(ruleIdParam) : null;

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

    if (this.isEditMode && this.ruleId) {
      this.bonusService.getBonusRule(this.ruleId).subscribe({
        next: (rule) => this.patchFormFromApi(rule),
        error: () => {
          this.toastService.show('Error', 'Failed to load rule', 'destructive');
          this.router.navigateByUrl('/manager/bonus-management/rules');
        },
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.toastService.show('Validation Error', 'Please fill in all required fields.', 'destructive');
      return;
    }

    this.submitting = true;
    const payload = this.buildPayload();

    const request$ = this.isEditMode && this.ruleId
      ? this.bonusService.updateRule(this.ruleId, payload)
      : this.bonusService.createRule(payload);

    request$.subscribe({
      next: () => {
        this.toastService.show(
          this.isEditMode ? 'Rule Updated' : 'Rule Created',
          this.isEditMode ? 'Rule updated successfully' : 'Rule created successfully',
        );
        this.router.navigateByUrl('/manager/bonus-management/rules');
      },
      error: () => {
        this.submitting = false;
        this.toastService.show('Error', 'Failed to save rule. Please try again.', 'destructive');
      },
    });
  }

  private buildPayload(): Record<string, any> {
    const v = this.form.value;
    const dimension: string = v.dimension;
    const isNumericDimension = dimension === 'SELL_AMOUNT';
    const isTextDimension = dimension === 'POTENTIAL_PRODUCT';
    const isTimeDimension = ['LEAD_TIME', 'SELL_TIME', 'USER_REG_TIME'].includes(dimension);
    const isDurationDimension = dimension === 'LEAD_TO_SELL_DELTA';

    const payload: Record<string, any> = {
      name: v.name,
      is_active: v.isActive,
      rule_dimension: dimension,
      operator: v.operator,
      amount_type: v.payoutType === 'percent' ? 'percent_of_sale' : 'fixed',
      amount_value: v.payoutValue,
      cap_amount: v.payoutType === 'percent' && v.capAmount ? v.capAmount : null,
      effective_from: v.effectiveFrom ? `${v.effectiveFrom}T00:00:00Z` : null,
      effective_to: v.effectiveTo ? `${v.effectiveTo}T23:59:59Z` : null,
      // Clear all condition fields, then set the relevant ones
      num_from: null,
      num_to: null,
      text_value: null,
      text_values: null,
      ts_from: null,
      ts_to: null,
      interval_from: null,
      interval_to: null,
    };

    const condVal = (v.conditionValue || '').trim();

    if (isNumericDimension) {
      if (v.operator === 'BETWEEN') {
        const parts = condVal.split(',').map((s: string) => s.trim());
        payload['num_from'] = parts[0] ? Number(parts[0]) : null;
        payload['num_to'] = parts[1] ? Number(parts[1]) : null;
      } else {
        payload['num_from'] = condVal ? Number(condVal) : null;
      }
    } else if (isTextDimension) {
      if (['IN', 'NOT_IN'].includes(v.operator)) {
        payload['text_values'] = condVal;
      } else {
        payload['text_value'] = condVal;
      }
    } else if (isTimeDimension) {
      if (v.operator === 'BETWEEN') {
        const parts = condVal.split(',').map((s: string) => s.trim());
        payload['ts_from'] = parts[0] ? `${parts[0]}T00:00:00Z` : null;
        payload['ts_to'] = parts[1] ? `${parts[1]}T23:59:59Z` : null;
      } else {
        payload['ts_from'] = condVal ? `${condVal}T00:00:00Z` : null;
      }
    } else if (isDurationDimension) {
      if (v.operator === 'BETWEEN') {
        const parts = condVal.split(',').map((s: string) => s.trim());
        payload['interval_from'] = parts[0] ? `${parts[0]}:00:00` : null;
        payload['interval_to'] = parts[1] ? `${parts[1]}:00:00` : null;
      } else {
        payload['interval_from'] = condVal ? `${condVal}:00:00` : null;
      }
    }

    return payload;
  }

  private patchFormFromApi(rule: any) {
    const dimension = rule.rule_dimension || 'SELL_AMOUNT';
    let conditionValue = '';

    if (dimension === 'SELL_AMOUNT') {
      conditionValue = rule.operator === 'BETWEEN'
        ? `${rule.num_from ?? ''}, ${rule.num_to ?? ''}`
        : `${rule.num_from ?? ''}`;
    } else if (dimension === 'POTENTIAL_PRODUCT') {
      conditionValue = rule.text_values || rule.text_value || '';
    } else if (['LEAD_TIME', 'SELL_TIME', 'USER_REG_TIME'].includes(dimension)) {
      conditionValue = rule.operator === 'BETWEEN'
        ? `${(rule.ts_from || '').split('T')[0]}, ${(rule.ts_to || '').split('T')[0]}`
        : `${(rule.ts_from || '').split('T')[0]}`;
    } else if (dimension === 'LEAD_TO_SELL_DELTA') {
      const parseDuration = (d: string | null) => d ? d.split(':')[0] : '';
      conditionValue = rule.operator === 'BETWEEN'
        ? `${parseDuration(rule.interval_from)}, ${parseDuration(rule.interval_to)}`
        : parseDuration(rule.interval_from);
    }

    this.form.patchValue({
      name: rule.name || '',
      isActive: rule.is_active ?? true,
      dimension,
      operator: rule.operator || 'GTE',
      conditionValue,
      payoutType: rule.amount_type === 'percent_of_sale' ? 'percent' : 'fixed',
      payoutValue: rule.amount_value || 0,
      capAmount: rule.cap_amount,
      priority: 100,
      effectiveFrom: rule.effective_from ? rule.effective_from.split('T')[0] : '',
      effectiveTo: rule.effective_to ? rule.effective_to.split('T')[0] : '',
    });
  }
}
