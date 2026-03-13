import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PageLayoutComponent } from '../../../shared/layouts/page-layout.component';
import { PageHeaderComponent } from '../../../shared/layouts/page-header.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent } from '../../../shared/ui/card.component';
import { LabelComponent } from '../../../shared/ui/label.component';
import { InputComponent } from '../../../shared/ui/input.component';
import { TextareaComponent } from '../../../shared/ui/textarea.component';
import { ButtonComponent } from '../../../shared/ui/button.component';
import { ToastService } from '../../../shared/ui/toast.service';
import { LeadService } from '../../../core/services/lead.service';

@Component({
  selector: 'app-create-lead',
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
    TextareaComponent,
    ButtonComponent,
  ],
  templateUrl: './create-lead.component.html',

  styleUrl: './create-lead.component.css',
})
export class CreateLeadComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toastService = inject(ToastService);
  private leadService = inject(LeadService);

  submitting = signal(false);

  interactionTypes = [
    { value: 'Phone', label: 'Phone', iconPath: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z', iconPath2: '' },
    { value: 'Email', label: 'Email', iconPath: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z', iconPath2: 'M22 6l-10 7L2 6' },
    { value: 'In Person', label: 'In Person', iconPath: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', iconPath2: 'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z' },
    { value: 'Online Chat', label: 'Online Chat', iconPath: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', iconPath2: '' },
  ];

  leadForm = this.fb.group({
    interactionType: ['', [Validators.required]],
    customerName: ['', [Validators.required]],
    customerPhone: ['', [Validators.required, Validators.minLength(7)]],
    notes: [''],
  });

  onSubmit() {
    if (this.leadForm.invalid) {
      this.leadForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const formValue = this.leadForm.value;
    const payload = {
      interaction_type: formValue.interactionType,
      customer_name: formValue.customerName,
      customer_phone: formValue.customerPhone,
    };

    this.leadService.createLead(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.toastService.show('Lead Created', 'The lead has been successfully created.');
        this.router.navigateByUrl('/agent');
      },
      error: () => {
        this.submitting.set(false);
        this.toastService.show('Error', 'Failed to create lead. Please try again.', 'destructive');
      },
    });
  }

  cancel() {
    this.router.navigateByUrl('/agent');
  }
}
