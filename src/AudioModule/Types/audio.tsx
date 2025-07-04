export interface AudioModel {
  id: string;
  name: string;
  description: string;
  type: 'image' | 'video' | 'audio';
  provider?: string;
  capabilities?: string[];
  parameters?: Record<string, ModelParameterConfig>;
}

export interface ModelParameterConfig {
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  default: any;
}