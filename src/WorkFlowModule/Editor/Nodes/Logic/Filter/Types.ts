export interface FilterConfig {
  filter_type: string;
  condition: string;
  value: any;
  custom_function: string;
}

export interface FilterInputs {
  array: any[];
}

export interface FilterOutputs {
  filtered: any[];
  count: number;
  removed_count: number;
}

