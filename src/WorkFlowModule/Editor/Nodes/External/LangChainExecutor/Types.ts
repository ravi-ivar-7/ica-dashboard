export interface LangChainExecutorConfig {
  chain_type: string;
  model: string;
  temperature: number;
  max_tokens: number;
  memory_type: string;
}

export interface LangChainExecutorInputs {
  input: string;
  context?: string;
  memory?: any;
}

export interface LangChainExecutorOutputs {
  output: string;
  memory: any;
  tokens_used: number;
  chain_steps: any[];
}

