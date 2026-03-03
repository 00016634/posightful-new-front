export type CompanySize = '1-10' | '11-50' | '51-200' | '201-500' | '500+';
export type Industry = 'insurance' | 'real-estate' | 'financial-services' | 'retail' | 'other';

export interface TenantSetupData {
  companyName: string;
  companySize: CompanySize;
  industry: Industry;
  adminFullName: string;
  adminEmail: string;
  adminPhone?: string;
  adminPassword: string;
  adminPasswordConfirm: string;
}

export interface PricingPlan {
  id: number;
  name: string;
  price: number;
  description: string;
  max_agents: number;
  storage_limit: string;
  features: string[];
  is_active: boolean;
}
