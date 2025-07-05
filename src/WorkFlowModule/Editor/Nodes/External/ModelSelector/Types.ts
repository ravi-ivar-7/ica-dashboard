export interface ModelSelectorConfig {
  selection_strategy: string;
  fallback_models: string[];
  performance_threshold: number;
  cost_threshold: number;
}

export interface ModelSelectorInputs {
  task_type: string;
  requirements?: any;
}

export interface ModelSelectorOutputs {
  selected_model: string;
  confidence: number;
  reasoning: string;
  alternatives: string[];
}

