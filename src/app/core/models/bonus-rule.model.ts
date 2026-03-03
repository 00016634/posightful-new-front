export type RuleDimension =
  | 'LEAD_TIME'
  | 'SELL_TIME'
  | 'USER_REG_TIME'
  | 'SELL_AMOUNT'
  | 'POTENTIAL_PRODUCT'
  | 'LEAD_TO_SELL_DELTA';

export type RuleOperator =
  | 'EQ' | 'NEQ'
  | 'GT' | 'GTE'
  | 'LT' | 'LTE'
  | 'BETWEEN'
  | 'IN' | 'NOT_IN';

export type AmountType = 'fixed' | 'percent_of_sale';

export interface BonusRule {
  id: string;
  name: string;
  is_active: boolean;
  rule_dimension: RuleDimension;
  operator: RuleOperator;
  ts_from?: string;
  ts_to?: string;
  num_from?: number;
  num_to?: number;
  interval_from?: string;
  interval_to?: string;
  text_values?: string[];
  text_value?: string;
  amount_type: AmountType;
  amount_value: number;
  cap_amount?: number;
  priority: number;
  effective_from: string;
  effective_to?: string;
}
