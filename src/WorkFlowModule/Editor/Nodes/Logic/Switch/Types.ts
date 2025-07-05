export interface SwitchConfig {
  cases: Array<{
    value: any;
    output_name: string;
  }>;
  default_output: string;
}

export interface SwitchInputs {
  input: any;
}

export interface SwitchOutputs {
  [key: string]: any;
}

