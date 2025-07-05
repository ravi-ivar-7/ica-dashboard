import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const audioEnhancementTemplate: NodeTemplate = {
  id: "audio-enhancement",
  type: "audio-enhancement",
  name: "Audio Enhancement",
  description: "Enhance audio quality (e.g., noise reduction, voice clarity)",
  category: "generation",
  icon: "🎧",
  inputs: [
    { name: "audio", type: "audio", required: true, description: "Audio file to enhance" },
  ],
  outputs: [
    { name: "audio", type: "audio", description: "Enhanced audio" },
    { name: "metadata", type: "any", description: "Enhancement metadata" },
  ],
  config: {
    model: "clarity-pro",
    enhancement_type: "noise-reduction", // noise-reduction, voice-clarity, equalization
  },
  aiModel: "Custom",
  requiresAuth: true,
  authProvider: "custom",
};

