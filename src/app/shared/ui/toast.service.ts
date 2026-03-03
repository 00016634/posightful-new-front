import { Injectable, signal, computed } from '@angular/core';

export interface Toast {
  id: number;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  private _nextId = 0;

  toasts = computed(() => this._toasts());

  show(title: string, description?: string, variant: 'default' | 'destructive' = 'default') {
    const id = this._nextId++;
    this._toasts.update(t => [...t, { id, title, description, variant }]);
    setTimeout(() => this.dismiss(id), 5000);
  }

  dismiss(id: number) {
    this._toasts.update(t => t.filter(toast => toast.id !== id));
  }
}
