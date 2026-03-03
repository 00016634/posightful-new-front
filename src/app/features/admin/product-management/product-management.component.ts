import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageLayoutComponent } from '../../../shared/layouts/page-layout.component';
import {
  CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
  ButtonComponent, LabelComponent, BadgeComponent,
  DialogComponent, DialogHeaderComponent, DialogTitleComponent, DialogFooterComponent,
} from '../../../shared/ui';
import { ProductService } from '../../../core/services/product.service';
import { ToastService } from '../../../shared/ui/toast.service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    PageLayoutComponent,
    CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
    ButtonComponent, LabelComponent, BadgeComponent,
    DialogComponent, DialogHeaderComponent, DialogTitleComponent, DialogFooterComponent,
  ],
  templateUrl: './product-management.component.html',

  styleUrl: './product-management.component.css',
})
export class ProductManagementComponent implements OnInit {
  router = inject(Router);
  private productService = inject(ProductService);
  private toastService = inject(ToastService);
  products = signal<any[]>([]);
  dialogOpen = signal(false);
  editingProduct = signal<any>(null);
  formData = signal({ name: '', description: '', category: 'Insurance' });

  ngOnInit() { this.loadProducts(); }

  private loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description ?? '',
          category: p.category ?? '',
          isActive: p.is_active,
          createdDate: p.created_at
            ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : '',
        })));
      },
      error: () => this.toastService.show('Error', 'Failed to load products', 'destructive'),
    });
  }

  updateFormField(field: string, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.formData.update(f => ({ ...f, [field]: value }));
  }

  openDialog(product: any) {
    this.editingProduct.set(product);
    this.formData.set(product
      ? { name: product.name, description: product.description, category: product.category }
      : { name: '', description: '', category: 'Insurance' });
    this.dialogOpen.set(true);
  }

  saveProduct() {
    const f = this.formData();
    if (!f.name) { this.toastService.show('Error', 'Product name is required', 'destructive'); return; }
    const payload = { name: f.name, category: f.category || '' };
    const e = this.editingProduct();
    if (e) {
      this.productService.updateProduct(e.id, payload).subscribe({
        next: () => {
          this.toastService.show('Updated', 'Product updated successfully');
          this.dialogOpen.set(false);
          this.loadProducts();
        },
        error: () => this.toastService.show('Error', 'Failed to update product', 'destructive'),
      });
    } else {
      this.productService.createProduct(payload).subscribe({
        next: () => {
          this.toastService.show('Created', 'Product created successfully');
          this.dialogOpen.set(false);
          this.loadProducts();
        },
        error: () => this.toastService.show('Error', 'Failed to create product', 'destructive'),
      });
    }
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.toastService.show('Deleted', 'Product deleted successfully');
        this.loadProducts();
      },
      error: () => this.toastService.show('Error', 'Failed to delete product', 'destructive'),
    });
  }
}
