import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageLayoutComponent } from '../../../shared/layouts/page-layout.component';
import {
  CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
  ButtonComponent, LabelComponent, DialogComponent, DialogHeaderComponent,
  DialogTitleComponent, DialogFooterComponent,
} from '../../../shared/ui';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../shared/ui/toast.service';

@Component({
  selector: 'app-product-funnel',
  standalone: true,
  imports: [
    PageLayoutComponent,
    CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
    ButtonComponent, LabelComponent, DialogComponent, DialogHeaderComponent,
    DialogTitleComponent, DialogFooterComponent,
  ],
  templateUrl: './product-funnel.component.html',

  styleUrl: './product-funnel.component.css',
})
export class ProductFunnelComponent implements OnInit {
  router = inject(Router);
  private productService = inject(ProductService);
  private toastService = inject(ToastService);

  products = signal<any[]>([]);
  editDialogOpen = signal(false);
  editProductId = signal(0);
  editForm = signal({ id: 0, name: '', description: '', order: 0 });

  ngOnInit() {
    this.productService.getProductFunnels().subscribe(data => this.products.set(data));
  }

  addStage(productId: number) {
    this.products.update(products =>
      products.map(p => {
        if (p.productId === productId) {
          const newStage = {
            id: Date.now(),
            name: 'New Stage',
            order: p.stages.length + 1,
            description: '',
          };
          return { ...p, stages: [...p.stages, newStage] };
        }
        return p;
      })
    );
    this.toastService.show('Stage Added', 'Stage added successfully');
  }

  updateEditField(field: string, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.editForm.update(f => ({ ...f, [field]: value }));
  }

  openEditDialog(productId: number, stage: any) {
    this.editProductId.set(productId);
    this.editForm.set({ id: stage.id, name: stage.name, description: stage.description, order: stage.order });
    this.editDialogOpen.set(true);
  }

  saveStage() {
    const form = this.editForm();
    this.products.update(products =>
      products.map(p => {
        if (p.productId === this.editProductId()) {
          return {
            ...p,
            stages: p.stages.map((s: any) =>
              s.id === form.id ? { ...s, name: form.name, description: form.description } : s
            ),
          };
        }
        return p;
      })
    );
    this.editDialogOpen.set(false);
    this.toastService.show('Stage Updated', 'Stage updated successfully');
  }

  deleteStage(productId: number, stageId: number) {
    this.products.update(products =>
      products.map(p => {
        if (p.productId === productId) {
          const stages = p.stages
            .filter((s: any) => s.id !== stageId)
            .map((s: any, idx: number) => ({ ...s, order: idx + 1 }));
          return { ...p, stages };
        }
        return p;
      })
    );
    this.toastService.show('Stage Deleted', 'Stage deleted successfully');
  }
}
