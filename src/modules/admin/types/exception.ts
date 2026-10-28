import type { CustomerType } from './location';

export type RuleOperator = 'equals' | 'notEquals' | 'in' | 'contains';

export interface ExceptionRule {
  id: string;
  attribute: string;
  operator: RuleOperator;
  value: string;
}

export interface GlobalException {
  id: string;
  title: string;
  geography: { name: string; lat: number; lon: number };
  type: string;
  customerType: CustomerType;
  rules: ExceptionRule[];
  addedOn: string;
  addedBy: string;
}

export const RULE_OPERATOR_OPTIONS: RuleOperator[] = ['equals', 'notEquals', 'in', 'contains'];
