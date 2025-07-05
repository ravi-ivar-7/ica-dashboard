import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const speechToTextTemplate: NodeTemplate = {
  id: "speech-to-text",
  type: "speech-to-text",
  name: "Speech to Text",
  description: "Convert audio to text using Whisper",
  category: "generation",
  icon: "🎤",
  inputs: [
    { name: "audio", type: "audio", required: true, description: "Audio file to transcribe" },
  ],
  outputs: [
    { name: "text", type: "text", description: "Transcribed text" },
    { name: "metadata", type: "any", description: "Transcription metadata" },
  ],
  config: {
    model: "whisper-1",
    language: "auto",
    response_format: "text",
  },
  aiModel: "Whisper",
  requiresAuth: true,
  authProvider: "openai",
};

