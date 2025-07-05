import { WorkflowNode, ExecutionContext, ExecutionResult } from "@/WorkFlowModule/Types/workflow";
import { ModelSelectorConfig, ModelSelectorInputs, ModelSelectorOutputs } from "./Types";

export async function executeModelSelector(
  node: WorkflowNode,
  context: ExecutionContext
): Promise<ExecutionResult> {
  const config = node.config as ModelSelectorConfig;
  const taskType = node.inputs.find(i => i.name === 'task_type')?.value;
  const requirements = node.inputs.find(i => i.name === 'requirements')?.value;

  if (!taskType) {
    return { success: false, error: "Task type is required for model selector node" };
  }

  try {
    const selectionStrategy = config.selection_strategy || 'balanced';
    const fallbackModels = config.fallback_models || ['gpt-3.5-turbo'];
    const performanceThreshold = config.performance_threshold || 0.8;
    const costThreshold = config.cost_threshold || 0.1;

    // Mock model database with capabilities and metrics
    const modelDatabase = {
      'text-generation': [
        { name: 'gpt-4-turbo', performance: 0.95, cost: 0.03, speed: 0.7, quality: 0.95 },
        { name: 'gpt-4', performance: 0.92, cost: 0.06, speed: 0.6, quality: 0.92 },
        { name: 'gpt-3.5-turbo', performance: 0.85, cost: 0.002, speed: 0.9, quality: 0.8 },
        { name: 'claude-3-opus', performance: 0.94, cost: 0.075, speed: 0.65, quality: 0.94 },
        { name: 'claude-3-sonnet', performance: 0.88, cost: 0.015, speed: 0.8, quality: 0.85 },
        { name: 'claude-3-haiku', performance: 0.82, cost: 0.0025, speed: 0.95, quality: 0.78 },
      ],
      'image-generation': [
        { name: 'dall-e-3', performance: 0.92, cost: 0.08, speed: 0.6, quality: 0.95 },
        { name: 'dall-e-2', performance: 0.85, cost: 0.02, speed: 0.8, quality: 0.82 },
        { name: 'midjourney', performance: 0.94, cost: 0.1, speed: 0.5, quality: 0.96 },
        { name: 'stable-diffusion-xl', performance: 0.88, cost: 0.01, speed: 0.9, quality: 0.85 },
      ],
      'code-generation': [
        { name: 'gpt-4-turbo', performance: 0.93, cost: 0.03, speed: 0.7, quality: 0.93 },
        { name: 'claude-3-opus', performance: 0.91, cost: 0.075, speed: 0.65, quality: 0.91 },
        { name: 'codellama-34b', performance: 0.87, cost: 0.005, speed: 0.85, quality: 0.85 },
        { name: 'gpt-3.5-turbo-instruct', performance: 0.82, cost: 0.002, speed: 0.9, quality: 0.78 },
      ],
      'speech-to-text': [
        { name: 'whisper-large-v3', performance: 0.95, cost: 0.006, speed: 0.8, quality: 0.95 },
        { name: 'whisper-medium', performance: 0.88, cost: 0.003, speed: 0.9, quality: 0.85 },
        { name: 'whisper-small', performance: 0.82, cost: 0.001, speed: 0.95, quality: 0.78 },
      ],
    };

    // Get available models for the task type
    const availableModels = modelDatabase[taskType as keyof typeof modelDatabase] || [];

    if (availableModels.length === 0) {
      return { 
        success: false, 
        error: `No models available for task type: ${taskType}` 
      };
    }

    // Parse requirements
    const reqSpeed = requirements?.speed || 0.5;
    const reqQuality = requirements?.quality || 0.5;
    const reqCost = requirements?.cost || 0.5;

    // Calculate scores based on selection strategy
    const scoredModels = availableModels.map(model => {
      let score = 0;
      
      switch (selectionStrategy) {
        case 'performance':
          score = model.performance * 0.7 + model.speed * 0.3;
          break;
        case 'cost':
          score = (1 - model.cost / 0.1) * 0.8 + model.performance * 0.2;
          break;
        case 'quality':
          score = model.quality * 0.8 + model.performance * 0.2;
          break;
        case 'balanced':
        default:
          score = (
            model.performance * 0.3 +
            model.quality * 0.3 +
            (1 - model.cost / 0.1) * 0.2 +
            model.speed * 0.2
          );
          break;
      }

      // Apply requirements weighting
      if (requirements) {
        score = score * 0.7 + (
          model.speed * reqSpeed * 0.1 +
          model.quality * reqQuality * 0.1 +
          (1 - model.cost / 0.1) * reqCost * 0.1
        );
      }

      return { ...model, score };
    });

    // Sort by score (descending)
    scoredModels.sort((a, b) => b.score - a.score);

    // Select best model
    let selectedModel = scoredModels[0];

    // Check if selected model meets thresholds
    if (selectedModel.performance < performanceThreshold || selectedModel.cost > costThreshold) {
      // Try fallback models
      for (const fallbackName of fallbackModels) {
        const fallback = scoredModels.find(m => m.name === fallbackName);
        if (fallback && fallback.performance >= performanceThreshold && fallback.cost <= costThreshold) {
          selectedModel = fallback;
          break;
        }
      }
    }

    // Generate reasoning
    const reasoning = `Selected ${selectedModel.name} for ${taskType} task using ${selectionStrategy} strategy. ` +
      `Performance: ${(selectedModel.performance * 100).toFixed(1)}%, ` +
      `Cost: $${selectedModel.cost.toFixed(4)}, ` +
      `Speed: ${(selectedModel.speed * 100).toFixed(1)}%, ` +
      `Quality: ${(selectedModel.quality * 100).toFixed(1)}%`;

    // Get alternatives (top 3 excluding selected)
    const alternatives = scoredModels
      .filter(m => m.name !== selectedModel.name)
      .slice(0, 3)
      .map(m => m.name);

    const outputs: ModelSelectorOutputs = {
      selected_model: selectedModel.name,
      confidence: selectedModel.score,
      reasoning: reasoning,
      alternatives: alternatives,
    };

    return {
      success: true,
      outputs: outputs,
    };
  } catch (error) {
    return {
      success: false,
      error: `Model selector execution failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

