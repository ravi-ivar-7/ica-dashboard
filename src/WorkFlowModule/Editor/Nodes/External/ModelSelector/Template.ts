import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const modelSelectorTemplate: NodeTemplate = {
  id: "model-selector",
  type: "model-selector",
  name: "Model Selector",
  description: "Intelligently select the best AI model for a given task",
  category: "external",
  icon: "🎯",
  inputs: [
    { name: "task_type", type: "text", required: true, description: "Type of task (e.g., text-generation, image-generation)" },
    { name: "requirements", type: "any", description: "Specific requirements (speed, quality, cost)" },
  ],
  outputs: [
    { name: "selected_model", type: "text", description: "Best model for the task" },
    { name: "confidence", type: "number", description: "Confidence in selection (0-1)" },
    { name: "reasoning", type: "text", description: "Explanation for model selection" },
    { name: "alternatives", type: "any", description: "Alternative model options" },
  ],
  config: {
    selection_strategy: "balanced", // performance, cost, balanced, quality
    fallback_models: ["gpt-3.5-turbo", "claude-3-haiku"],
    performance_threshold: 0.8,
    cost_threshold: 0.1, // dollars per request
  },
};

