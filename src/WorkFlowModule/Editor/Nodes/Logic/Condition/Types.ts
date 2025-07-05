export interface ConditionConfig {
  operator: string;
  value: any;
  case_sensitive: boolean;
}

export interface ConditionInputs {
  input: any;
  condition?: any;
}

export interface ConditionOutputs {
  true?: any;
  false?: any;
}

