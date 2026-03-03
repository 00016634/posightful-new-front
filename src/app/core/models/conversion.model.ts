export interface Conversion {
  id: number;
  tenant_id: number;
  lead_id: number;
  agent_id: number;
  campaign_id?: number;
  sale_id: string;
  sale_date: string;
  revenue_amount: number;
  cost_amount?: number;
  is_verified: boolean;
  verified_at?: string;
  verified_by?: number;
  created_at: string;
  lead?: any;
  agent?: any;
}

export interface ConversionStats {
  total_conversions: number;
  total_revenue: number;
  average_revenue: number;
  conversion_rate: number;
}
