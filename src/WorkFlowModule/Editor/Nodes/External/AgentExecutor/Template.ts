import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const agentExecutorTemplate: NodeTemplate = {
  id: "agent-executor",
  type: "agent-executor",
  name: "Agent Executor",
  description: "Execute complex tasks using AI agents with tool access",
  category: "external",
  icon: "🤖",
  inputs: [
    { name: "task", type: "text", required: true, description: "Task for the agent to execute" },
    { name: "context", type: "text", description: "Additional context for the task" },
  ],
  outputs: [
    { name: "result", type: "any", description: "Agent execution result" },
    { name: "steps", type: "any", description: "Execution steps taken by the agent" },
    { name: "tokens_used", type: "number", description: "Number of tokens consumed" },
    { name: "execution_time", type: "number", description: "Execution time in milliseconds" },
  ],
  config: {
    agent_type: "react", // react, plan-and-execute, conversational
    model: "gpt-4",
    max_iterations: 10,
    tools: ["search", "calculator", "code_interpreter"],
    temperature: 0.7,
  },
  aiModel: "OpenAI",
  requiresAuth: true,
  authProvider: "openai",
};

