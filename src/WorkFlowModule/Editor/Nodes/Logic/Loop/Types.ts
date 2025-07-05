export interface LoopConfig {
  max_iterations: number;
  parallel: boolean;
  break_on_error: boolean;
}

export interface LoopInputs {
  items: any[];
  template: any;
}

export interface LoopOutputs {
  results: any[];
  count: number;
  errors: any[];
}

