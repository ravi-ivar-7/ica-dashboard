import { ApiResponse, Style, Model, Activity, Filter, Pagination, User } from '../../DashboardModule/Types/dashboard';
import {Asset} from "@/AssetsModule/Types/assets";
// Base API URL - would be replaced with actual API endpoint
const API_BASE_URL = '/api';

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const errorData = await response.json();
    return {
      success: false,
      error: {
        code: errorData.code || response.status.toString(),
        message: errorData.message || 'An error occurred',
        details: errorData.details
      }
    };
  }

  const data = await response.json();
  return {
    success: true,
    data
  };
}

// Assets API
export const assetsApi = {
  getAll: async (filter?: Filter, pagination?: Pagination): Promise<ApiResponse<{ assets: Asset[], pagination: Pagination }>> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filter?.search) queryParams.append('search', filter.search);
      if (filter?.type && filter.type !== 'all') queryParams.append('type', filter.type);
      if (filter?.status && filter.status !== 'all') queryParams.append('status', filter.status);
      if (filter?.tags?.length) queryParams.append('tags', filter.tags.join(','));
      if (filter?.sortBy) queryParams.append('sortBy', filter.sortBy);
      if (filter?.sortDirection) queryParams.append('sortDirection', filter.sortDirection);
      
      if (pagination?.page) queryParams.append('page', pagination.page.toString());
      if (pagination?.limit) queryParams.append('limit', pagination.limit.toString());
      
      const response = await fetch(`${API_BASE_URL}/assets?${queryParams.toString()}`);
      return handleResponse<{ assets: Asset[], pagination: Pagination }>(response);
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error occurred',
          details: error
        }
      };
    }
  },
  
  getById: async (id: string): Promise<ApiResponse<Asset>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/assets/${id}`);
      return handleResponse<Asset>(response);
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error occurred',
          details: error
        }
      };
    }
  },
  
  create: async (formData: FormData): Promise<ApiResponse<Asset>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/assets`, {
        method: 'POST',
        body: formData
      });
      return handleResponse<Asset>(response);
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error occurred',
          details: error
        }
      };
    }
  },
  
  update: async (id: string, data: Partial<Asset>): Promise<ApiResponse<Asset>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return handleResponse<Asset>(response);
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error occurred',
          details: error
        }
      };
    }
  },
  
  delete: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/assets/${id}`, {
        method: 'DELETE'
      });
      return handleResponse<void>(response);
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error occurred',
          details: error
        }
      };
    }
  }
};

// Styles API
export const stylesApi = {
  getAll: async (filter?: Filter, pagination?: Pagination): Promise<ApiResponse<{ styles: Style[], pagination: Pagination }>> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (filter?.search) queryParams.append('search', filter.search);
      if (filter?.type && filter.type !== 'all') queryParams.append('type', filter.type);
      if (filter?.tags?.length) queryParams.append('tags', filter.tags.join(','));
      if (filter?.sortBy) queryParams.append('sortBy', filter.sortBy);
      if (filter?.sortDirection) queryParams.append('sortDirection', filter.sortDirection);
      
      if (pagination?.page) queryParams.append('page', pagination.page.toString());
      if (pagination?.limit) queryParams.append('limit', pagination.limit.toString());
      
      const response = await fetch(`${API_BASE_URL}/styles?${queryParams.toString()}`);
      return handleResponse<{ styles: Style[], pagination: Pagination }>(response);
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error occurred',
          details: error
        }
      };
    }
  },
  
  getById: async (id: string): Promise<ApiResponse<Style>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/styles/${id}`);
      return handleResponse<Style>(response);
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error occurred',
          details: error
        }
      };
    }
  },
  
  create: async (formData: FormData): Promise<ApiResponse<Style>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/styles`, {
        method: 'POST',
        body: formData
      });
      return handleResponse<Style>(response);
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error occurred',
          details: error
        }
      };
    }
  },
  
  update: async (id: string, data: Partial<Style>): Promise<ApiResponse<Style>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/styles/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return handleResponse<Style>(response);
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error occurred',
          details: error
        }
      };
    }
  },
  
  delete: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/styles/${id}`, {
        method: 'DELETE'
      });
      return handleResponse<void>(response);
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error occurred',
          details: error
        }
      };
    }
  }
};

// Models API
export const modelsApi = {
  getAll: async (type?: 'image' | 'video' | 'audio'): Promise<ApiResponse<Model[]>> => {
    try {
      const queryParams = new URLSearchParams();
      if (type) queryParams.append('type', type);
      
      const response = await fetch(`${API_BASE_URL}/models?${queryParams.toString()}`);
      return handleResponse<Model[]>(response);
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error occurred',
          details: error
        }
      };
    }
  },
  
  getById: async (id: string): Promise<ApiResponse<Model>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/models/${id}`);
      return handleResponse<Model>(response);
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error occurred',
          details: error
        }
      };
    }
  }
};

// Activity API
export const activityApi = {
  getAll: async (pagination?: Pagination): Promise<ApiResponse<{ activities: Activity[], pagination: Pagination }>> => {
    try {
      const queryParams = new URLSearchParams();
      
      if (pagination?.page) queryParams.append('page', pagination.page.toString());
      if (pagination?.limit) queryParams.append('limit', pagination.limit.toString());
      
      const response = await fetch(`${API_BASE_URL}/activities?${queryParams.toString()}`);
      return handleResponse<{ activities: Activity[], pagination: Pagination }>(response);
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error occurred',
          details: error
        }
      };
    }
  }
};

// User API
export const userApi = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`);
      return handleResponse<User>(response);
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error occurred',
          details: error
        }
      };
    }
  },
  
  updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      return handleResponse<User>(response);
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error occurred',
          details: error
        }
      };
    }
  }
};

// For mock data in development
export const mockApi = {
  getAssets: (): Asset[] => {
    return [
      {
        id: '1',
        name: 'Portrait_Style_v2.jpg',
        type: 'image',
        thumbnail: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
        size: '2.4 MB',
        dimensions: '1024x1024',
        createdAt: '2 hours ago',
        updatedAt: '2 hours ago',
        status: 'ready',
        likes: 24,
        views: 156,
        tags: ['portrait', 'professional', 'studio'],
        styleId: 's1',
        modelId: 'm1'
      },
      {
        id: '2',
        name: 'Cinematic_Reel.mp4',
        type: 'video',
        thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        url: 'https://example.com/video.mp4',
        size: '45.2 MB',
        duration: '00:02:34',
        createdAt: '5 hours ago',
        updatedAt: '5 hours ago',
        status: 'processing',
        likes: 12,
        views: 89,
        tags: ['cinematic', 'reel', 'motion'],
        styleId: 's2',
        modelId: 'm2'
      },
      {
        id: '3',
        name: 'Brand_Logo_Variations.jpg',
        type: 'image',
        thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        url: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
        size: '1.8 MB',
        dimensions: '1200x800',
        createdAt: '1 day ago',
        updatedAt: '1 day ago',
        status: 'ready',
        likes: 45,
        views: 234,
        tags: ['brand', 'logo', 'business'],
        styleId: 's3',
        modelId: 'm1'
      },
      {
        id: '4',
        name: 'Ambient_Track.mp3',
        type: 'audio',
        thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        url: 'https://example.com/audio.mp3',
        size: '8.7 MB',
        duration: '00:03:45',
        createdAt: '2 days ago',
        updatedAt: '2 days ago',
        status: 'ready',
        likes: 18,
        views: 67,
        tags: ['ambient', 'music', 'relaxation'],
        styleId: 's4',
        modelId: 'm3'
      }
    ];
  },
  
  getStyles: (): Style[] => {
    return [
      {
        id: 's1',
        name: 'Professional Portrait',
        description: 'Studio-quality professional headshots with perfect lighting',
        thumbnail: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        type: 'image',
        status: 'ready',
        progress: 100,
        createdAt: '1 week ago',
        updatedAt: '1 day ago',
        version: 2,
        isPublic: true,
        usageCount: 156,
        tags: ['portrait', 'professional', 'studio']
      },
      {
        id: 's2',
        name: 'Cinematic Motion',
        description: 'Dramatic cinematic style with film-like quality',
        thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        type: 'video',
        status: 'ready',
        progress: 100,
        createdAt: '2 weeks ago',
        updatedAt: '3 days ago',
        version: 1,
        isPublic: false,
        usageCount: 89,
        tags: ['cinematic', 'film', 'dramatic']
      },
      {
        id: 's3',
        name: 'Brand Identity',
        description: 'Consistent brand assets with corporate aesthetic',
        thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        type: 'image',
        status: 'ready',
        progress: 100,
        createdAt: '3 weeks ago',
        updatedAt: '1 week ago',
        version: 3,
        isPublic: true,
        usageCount: 234,
        tags: ['brand', 'corporate', 'identity']
      },
      {
        id: 's4',
        name: 'Ambient Soundscape',
        description: 'Relaxing ambient audio with natural elements',
        thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
        type: 'audio',
        status: 'training',
        progress: 75,
        createdAt: '1 day ago',
        updatedAt: '2 hours ago',
        version: 1,
        isPublic: false,
        usageCount: 12,
        tags: ['ambient', 'relaxation', 'nature']
      }
    ];
  },
  
  getModels: (): Model[] => {
    return [
      {
        id: 'm1',
        name: 'SDXL',
        description: 'High-quality image generation with exceptional detail',
        type: 'image',
        capabilities: ['High-Res', 'Detailed', 'Fast'],
        parameters: [
          {
            id: 'p1',
            name: 'Prompt',
            description: 'Describe what you want to generate',
            type: 'text',
            defaultValue: ''
          },
          {
            id: 'p2',
            name: 'Negative Prompt',
            description: 'Describe what you want to avoid',
            type: 'text',
            defaultValue: ''
          },
          {
            id: 'p3',
            name: 'CFG Scale',
            description: 'How closely to follow the prompt',
            type: 'slider',
            min: 1,
            max: 20,
            step: 0.5,
            defaultValue: 7
          },
          {
            id: 'p4',
            name: 'Resolution',
            description: 'Output image size',
            type: 'select',
            options: [
              { value: '512x512', label: '512x512' },
              { value: '768x768', label: '768x768' },
              { value: '1024x1024', label: '1024x1024' }
            ],
            defaultValue: '1024x1024'
          }
        ]
      },
      {
        id: 'm2',
        name: 'Veo 3',
        description: 'Next-gen video generation with unprecedented quality',
        type: 'video',
        capabilities: ['Realistic', 'Video', 'Motion'],
        parameters: [
          {
            id: 'p1',
            name: 'Prompt',
            description: 'Describe what you want to generate',
            type: 'text',
            defaultValue: ''
          },
          {
            id: 'p2',
            name: 'Duration',
            description: 'Length of generated video',
            type: 'select',
            options: [
              { value: '5', label: '5 seconds' },
              { value: '10', label: '10 seconds' },
              { value: '15', label: '15 seconds' }
            ],
            defaultValue: '10'
          },
          {
            id: 'p3',
            name: 'FPS',
            description: 'Frames per second',
            type: 'select',
            options: [
              { value: '24', label: '24 FPS' },
              { value: '30', label: '30 FPS' },
              { value: '60', label: '60 FPS' }
            ],
            defaultValue: '30'
          }
        ]
      },
      {
        id: 'm3',
        name: 'AudioCraft',
        description: 'Comprehensive music and audio creation',
        type: 'audio',
        capabilities: ['Music', 'Voice', 'Sound'],
        parameters: [
          {
            id: 'p1',
            name: 'Prompt',
            description: 'Describe what you want to generate',
            type: 'text',
            defaultValue: ''
          },
          {
            id: 'p2',
            name: 'Duration',
            description: 'Length of generated audio',
            type: 'select',
            options: [
              { value: '30', label: '30 seconds' },
              { value: '60', label: '1 minute' },
              { value: '120', label: '2 minutes' }
            ],
            defaultValue: '60'
          },
          {
            id: 'p3',
            name: 'Genre',
            description: 'Musical style',
            type: 'select',
            options: [
              { value: 'ambient', label: 'Ambient' },
              { value: 'electronic', label: 'Electronic' },
              { value: 'classical', label: 'Classical' }
            ],
            defaultValue: 'ambient'
          }
        ]
      }
    ];
  }
};