import { NodeTemplate } from "@/WorkFlowModule/Types/workflow";

export const textToSpeechTemplate: NodeTemplate = {
  id: "text-to-speech",
  type: "text-to-speech",
  name: "Text to Speech",
  description: "Convert text to speech audio using various TTS models",
  category: "generation",
  icon: "🔊",
  inputs: [
    { name: "text", type: "text", required: true, description: "Text to convert to speech" },
    { name: "voice", type: "text", description: "Voice to use for synthesis" },
  ],
  outputs: [
    { name: "audio", type: "audio", description: "Generated speech audio" },
    { name: "duration", type: "number", description: "Audio duration in seconds" },
    { name: "voice_used", type: "text", description: "Voice that was used" },
  ],
  config: {
    model: "openai-tts-1", // openai-tts-1, openai-tts-1-hd, elevenlabs, azure
    voice: "alloy", // alloy, echo, fable, onyx, nova, shimmer
    speed: 1.0,
    format: "mp3", // mp3, opus, aac, flac
  },
  aiModel: "OpenAI",
  requiresAuth: true,
  authProvider: "openai",
};

