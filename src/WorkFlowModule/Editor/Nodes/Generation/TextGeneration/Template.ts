import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const textGenerationTemplate: NodeTemplate = {
  id: "text-generation",
  type: "text-generation",
  name: "Text Generation",
  description: "Generate text using AI language models",
  category: "generation",
  icon: "✍️",
  inputs: [
    { name: "prompt", type: "text", required: true, description: "Input prompt" },
    { name: "context", type: "text", description: "Additional context" },
  ],
  outputs: [
    { name: "text", type: "text", description: "Generated text" },
    { name: "metadata", type: "any", description: "Generation metadata" },
  ],
  config: {
    model: "gpt-4",
    max_tokens: 1000,
    temperature: 0.7,
    top_p: 1.0,
  },
  aiModel: "OpenAI",
  requiresAuth: true,
  authProvider: "openai",
};

