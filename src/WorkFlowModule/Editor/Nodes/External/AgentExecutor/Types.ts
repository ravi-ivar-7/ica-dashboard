export interface AgentExecutorConfig {
  agent_type: string;
  model: string;
  max_iterations: number;
  tools: string[];
  temperature: number;
}

export interface AgentExecutorInputs {
  task: string;
  context?: string;
}

export interface AgentExecutorOutputs {
  result: any;
  steps: any[];
  tokens_used: number;
  execution_time: number;
}

