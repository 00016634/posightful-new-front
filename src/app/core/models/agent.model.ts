export interface Agent {
  id: number;
  tenant_id: number;
  user_id: number;
  outlet_id?: number;
  employee_code: string;
  hire_date: string;
  status: 'active' | 'inactive' | 'suspended';
  notes?: string;
  created_at: string;
  user?: any; // Will be populated with user data
  outlet?: Outlet;
}

export interface Outlet {
  id: number;
  tenant_id: number;
  region_id?: number;
  name: string;
  code: string;
  type: 'store' | 'campus' | 'pop_up' | 'partner';
  address?: string;
  city?: string;
  is_active: boolean;
  created_at: string;
  region?: Region;
}

export interface Region {
  id: number;
  tenant_id: number;
  name: string;
  code: string;
  parent_region_id?: number;
  created_at: string;
}
