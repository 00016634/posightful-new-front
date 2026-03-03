export interface Lead {
  id: number;
  uuid: string;
  tenant_id: number;
  campaign_id?: number;
  agent_id?: number;
  source_id?: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_id_number?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  captured_at: string;
  captured_offline: boolean;
  synced_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadCreateRequest {
  uuid: string;
  campaign_id?: number;
  source_id?: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_id_number?: string;
  captured_offline: boolean;
  notes?: string;
}

export interface Campaign {
  id: number;
  tenant_id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget?: number;
  created_at: string;
}

export interface AttributionSource {
  id: number;
  tenant_id: number;
  name: string;
  type: 'walk_in' | 'partner_outlet' | 'street_team' | 'online' | 'referral';
  description?: string;
}
