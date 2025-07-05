export interface MapConfig {
  transformation: string;
  custom_function: string;
}

export interface MapInputs {
  array: any[];
}

export interface MapOutputs {
  mapped: any[];
  count: number;
}

