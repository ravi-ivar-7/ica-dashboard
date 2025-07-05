import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const videoGenerationTemplate: NodeTemplate = {
  id: "video-generation",
  type: "video-generation",
  name: "Video Generation",
  description: "Generate videos from text or image prompts",
  category: "generation",
  icon: "🎬",
  inputs: [
    { name: "prompt", type: "text", required: true, description: "Text prompt for video generation" },
    { name: "image", type: "image", description: "Starting image for video" },
  ],
  outputs: [
    { name: "video", type: "video", description: "Generated video" },
    { name: "metadata", type: "any", description: "Generation metadata" },
  ],
  config: {
    model: "Veo",
    duration: 5,
    fps: 24,
    resolution: "1280x720",
  },
  aiModel: "Veo",
  requiresAuth: true,
  authProvider: "google",
};

