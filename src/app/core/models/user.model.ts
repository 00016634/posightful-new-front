export interface User {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  full_name: string;
  tenant: number | null;
  is_active: boolean;
  is_staff: boolean;
  is_superuser?: boolean;
  created_at: string;
  roles?: Role[];
}

export interface Role {
  id: number;
  code: string;
  name: string;
  description?: string;
  permissions: Record<string, string[]>;
  color: string;
  icon: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
  message?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  phone_number: string;
  full_name?: string;
  password: string;
  password2: string;
  tenant?: number;
}
