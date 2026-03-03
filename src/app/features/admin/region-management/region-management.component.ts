import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PageLayoutComponent } from '../../../shared/layouts/page-layout.component';
import {
  CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
  ButtonComponent, LabelComponent, BadgeComponent,
} from '../../../shared/ui';
import { RegionService, Region } from '../../../core/services/region.service';
import { ToastService } from '../../../shared/ui/toast.service';

@Component({
  selector: 'app-region-management',
  standalone: true,
  imports: [
    ReactiveFormsModule, PageLayoutComponent,
    CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
    ButtonComponent, LabelComponent, BadgeComponent,
  ],
  templateUrl: './region-management.component.html',

  styleUrl: './region-management.component.css',
})
export class RegionManagementComponent implements OnInit {
  router = inject(Router);
  private regionService = inject(RegionService);
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  regions = signal<Region[]>([]);
  form = this.fb.group({
    name: ['', Validators.required],
    code: [''],
  });

  ngOnInit() { this.loadRegions(); }

  private loadRegions() {
    this.regionService.getRegions().subscribe({
      next: (data) => this.regions.set(data),
      error: () => this.toastService.show('Error', 'Failed to load regions', 'destructive'),
    });
  }

  addRegion() {
    if (this.form.invalid) return;
    const { name, code } = this.form.value;
    this.regionService.createRegion({ name: name!, code: code || undefined }).subscribe({
      next: () => {
        this.toastService.show('Created', 'Region added successfully');
        this.form.reset();
        this.loadRegions();
      },
      error: () => this.toastService.show('Error', 'Failed to create region', 'destructive'),
    });
  }

  deleteRegion(region: Region) {
    this.regionService.deleteRegion(region.id).subscribe({
      next: () => {
        this.toastService.show('Deleted', `Region "${region.name}" removed`);
        this.loadRegions();
      },
      error: () => this.toastService.show('Error', 'Failed to delete region', 'destructive'),
    });
  }
}
