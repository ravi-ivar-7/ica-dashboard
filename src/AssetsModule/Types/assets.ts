export interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio';
  thumbnail: string;
  url: string;
  size: string;
  dimensions?: string;
  duration?: string;
  createdAt: string;
  updatedAt: string;
  status: 'processing' | 'ready' | 'failed';
  likes: number;
  views: number;
  tags: string[];
  styleId?: string;
  modelId?: string;
}