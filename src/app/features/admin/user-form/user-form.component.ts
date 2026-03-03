import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageLayoutComponent } from '../../../shared/layouts/page-layout.component';
import {
  CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
  ButtonComponent, LabelComponent, SwitchComponent,
} from '../../../shared/ui';
import { ToastService } from '../../../shared/ui/toast.service';
import { RegionService, Region } from '../../../core/services/region.service';
import { UserManagementService } from '../../../core/services/user-management.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, PageLayoutComponent,
    CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
    ButtonComponent, LabelComponent, SwitchComponent,
  ],
  templateUrl: './user-form.component.html',

  styleUrl: './user-form.component.css',
})
export class UserFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private regionService = inject(RegionService);
  private userService = inject(UserManagementService);

  isEditMode = false;
  userId: string | null = null;
  form!: FormGroup;
  regions = signal<Region[]>([]);

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.isEditMode = !!this.userId && this.userId !== 'new';

    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      role: ['agent', Validators.required],
      region: [''],
      hireDate: [''],
      password: [''],
      isActive: [true],
    });

    this.regionService.getRegions().subscribe({
      next: (data) => this.regions.set(data),
    });

    if (this.isEditMode && this.userId) {
      this.userService.getUserById(+this.userId).subscribe({
        next: (user) => {
          this.form.patchValue({
            fullName: user.full_name,
            email: user.email,
            phone: user.phone_number || '',
            role: user.roles?.[0]?.toLowerCase() || 'agent',
            region: user.region || '',
            hireDate: user.hire_date || '',
            isActive: user.is_active,
          });
        },
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.toastService.show('Error', 'Please fill required fields', 'destructive');
      return;
    }

    const val = this.form.value;
    const payload: any = {
      full_name: val.fullName,
      email: val.email,
      phone_number: val.phone || '',
      role: val.role,
    };

    if (this.isEditMode && this.userId) {
      payload.is_active = val.isActive;
      this.userService.updateUser(+this.userId, payload).subscribe({
        next: () => {
          this.toastService.show('Updated', 'User updated successfully');
          this.router.navigateByUrl('/admin/users');
        },
        error: () => this.toastService.show('Error', 'Failed to update user', 'destructive'),
      });
    } else {
      if (val.password) payload.password = val.password;
      this.userService.createUser(payload).subscribe({
        next: () => {
          this.toastService.show('Created', 'User created successfully');
          this.router.navigateByUrl('/admin/users');
        },
        error: () => this.toastService.show('Error', 'Failed to create user', 'destructive'),
      });
    }
  }
}
