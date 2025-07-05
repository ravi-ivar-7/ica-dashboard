import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const langChainExecutorTemplate: NodeTemplate = {
  id: "langchain-executor",
  type: "langchain-executor",
  name: "LangChain Executor",
  description: "Execute LangChain workflows with memory and chain management",
  category: "external",
  icon: "🔗",
  inputs: [
    { name: "input", type: "text", required: true, description: "Input for the LangChain workflow" },
    { name: "context", type: "text", description: "Additional context" },
    { name: "memory", type: "any", description: "Previous conversation memory" },
  ],
  outputs: [
    { name: "output", type: "text", description: "LangChain workflow output" },
    { name: "memory", type: "any", description: "Updated conversation memory" },
    { name: "tokens_used", type: "number", description: "Number of tokens consumed" },
    { name: "chain_steps", type: "any", description: "Steps executed in the chain" },
  ],
  config: {
    chain_type: "conversation", // conversation, sequential, map_reduce, stuff, refine
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    max_tokens: 1000,
    memory_type: "buffer", // buffer, summary, entity, kg
  },
  aiModel: "OpenAI",
  requiresAuth: true,
  authProvider: "openai",
};

