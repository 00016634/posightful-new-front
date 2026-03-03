export interface KPIAgentDaily {
  id: number;
  tenant_id: number;
  agent_id: number;
  date: string;
  leads_captured: number;
  leads_converted: number;
  conversion_rate: number;
  revenue_generated: number;
  bonus_earned: number;
  created_at: string;
  agent?: any;
}

export interface KPIOutletDaily {
  id: number;
  tenant_id: number;
  outlet_id: number;
  date: string;
  leads_captured: number;
  leads_converted: number;
  conversion_rate: number;
  revenue_generated: number;
  created_at: string;
  outlet?: any;
}

export interface DashboardStats {
  today_leads: number;
  today_conversions: number;
  today_revenue: number;
  week_leads: number;
  week_conversions: number;
  week_revenue: number;
  month_leads: number;
  month_conversions: number;
  month_revenue: number;
  conversion_rate: number;
  top_agents: AgentPerformance[];
  recent_leads: any[];
}

export interface AgentPerformance {
  agent_id: number;
  agent_name: string;
  leads: number;
  conversions: number;
  revenue: number;
  conversion_rate: number;
}
