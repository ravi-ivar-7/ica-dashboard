export interface TimerConfig {
  interval: number;
  max_iterations: number;
  auto_start: boolean;
}

export interface TimerInputs {
  start?: boolean;
  stop?: boolean;
}

export interface TimerOutputs {
  tick: number;
  elapsed: number;
  is_running: boolean;
}

