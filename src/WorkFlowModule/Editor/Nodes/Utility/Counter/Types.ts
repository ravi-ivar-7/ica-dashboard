export interface CounterConfig {
  initial_value: number;
  increment: number;
  max_value: number;
  reset_on_max: boolean;
}

export interface CounterInputs {
  increment?: boolean;
  decrement?: boolean;
  reset?: boolean;
}

export interface CounterOutputs {
  count: number;
  is_max: boolean;
}

