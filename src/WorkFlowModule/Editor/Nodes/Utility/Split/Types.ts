export interface SplitConfig {
  split_type: string;
  delimiter: string;
  max_splits: number;
}

export interface SplitInputs {
  input: any;
}

export interface SplitOutputs {
  output1: any;
  output2: any;
  output3: any;
  array: any[];
}

