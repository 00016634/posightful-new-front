export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  createdDate: string;
}

export interface FunnelStage {
  id: string;
  name: string;
  order: number;
  description: string;
}

export interface ProductWithFunnel {
  id: string;
  name: string;
  stages: FunnelStage[];
}
