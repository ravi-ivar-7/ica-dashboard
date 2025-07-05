export interface VariableSetterConfig {
  variable_name: string;
  scope: string;
  persist: boolean;
}

export interface VariableSetterInputs {
  value: any;
}

export interface VariableSetterOutputs {
  output: any;
  variable_name: string;
}

