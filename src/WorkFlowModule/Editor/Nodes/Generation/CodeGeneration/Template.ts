import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const codeGenerationTemplate: NodeTemplate = {
  id: "code-generation",
  type: "code-generation",
  name: "Code Generation",
  description: "Generate code snippets or full programs using AI models",
  category: "generation",
  icon: "💻",
  inputs: [
    { name: "prompt", type: "text", required: true, description: "Text prompt for code generation" },
    { name: "context", type: "text", description: "Additional context or requirements" },
  ],
  outputs: [
    { name: "code", type: "text", description: "Generated code" },
    { name: "metadata", type: "any", description: "Generation metadata" },
  ],
  config: {
    model: "codellama",
    language: "python",
    max_tokens: 2000,
    temperature: 0.7,
  },
  aiModel: "CodeLlama",
  requiresAuth: true,
  authProvider: "huggingface",
};

