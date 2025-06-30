// Common types used across dashboard components

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'studio';
  credits: number;
  maxCredits: number;
}

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

export interface Style {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  type: 'image' | 'video' | 'audio';
  status: 'training' | 'ready' | 'failed';
  progress: number;
  createdAt: string;
  updatedAt: string;
  version: number;
  isPublic: boolean;
  usageCount: number;
  tags: string[];
}

export interface Model {
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

export interface ModelParameter {
  id: string;
  name: string;
  description: string;
  type: 'slider' | 'select' | 'checkbox' | 'color' | 'text';
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  defaultValue: any;
}

export interface Activity {
  id: string;
  type: 'generation' | 'training' | 'upload' | 'download' | 'delete' | 'edit';
  assetId?: string;
  styleId?: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  details: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Filter {
  search?: string;
  type?: 'image' | 'video' | 'audio' | 'all';
  status?: 'processing' | 'ready' | 'failed' | 'all';
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
  sortBy?: 'name' | 'date' | 'size' | 'popularity';
  sortDirection?: 'asc' | 'desc';
}