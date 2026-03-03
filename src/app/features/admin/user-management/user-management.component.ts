import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PageLayoutComponent } from '../../../shared/layouts/page-layout.component';
import {
  CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
  ButtonComponent, LabelComponent, AvatarComponent,
  TableComponent, TableHeaderComponent, TableBodyComponent,
  TableRowComponent, TableHeadComponent, TableCellComponent,
} from '../../../shared/ui';
import { UserManagementService } from '../../../core/services/user-management.service';
import { ToastService } from '../../../shared/ui/toast.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    FormsModule, PageLayoutComponent,
    CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent,
    ButtonComponent, LabelComponent, AvatarComponent,
    TableComponent, TableHeaderComponent, TableBodyComponent,
    TableRowComponent, TableHeadComponent, TableCellComponent,
  ],
  templateUrl: './user-management.component.html',

  styleUrl: './user-management.component.css',
})
export class UserManagementComponent implements OnInit {
  router = inject(Router);
  private userService = inject(UserManagementService);
  private toastService = inject(ToastService);
  users = signal<any[]>([]);
  searchTerm = '';
  filterRole = 'all';
  filterStatus = 'all';
  filteredUsers = computed(() => this.users().filter(u => {
    const s = !this.searchTerm || u.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) || u.email.toLowerCase().includes(this.searchTerm.toLowerCase());
    const r = this.filterRole === 'all' || u.role === this.filterRole;
    const st = this.filterStatus === 'all' || u.status === this.filterStatus;
    return s && r && st;
  }));
  ngOnInit() { this.userService.getUsers().subscribe(d => this.users.set(d)); }
  deleteUser(id: number) { this.users.update(u => u.filter(x => x.id !== id)); this.toastService.show('Deleted', 'User deleted successfully'); }
  initials(name: string) { return name.split(' ').map(n => n[0]).join(''); }
  roleBadge(role: string) {
    const c: Record<string, string> = { agent: 'bg-blue-100 text-blue-800', supervisor: 'bg-purple-100 text-purple-800', manager: 'bg-green-100 text-green-800', accountant: 'bg-orange-100 text-orange-800', admin: 'bg-red-100 text-red-800' };
    return c[role] || 'bg-gray-100 text-gray-800';
  }
}
