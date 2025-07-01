// services/api/projects.ts

import type { CineFlowProject } from "../../types/cineflow";

const API_BASE_URL = '/api/projects';


const mockProjects: CineFlowProject[] = [
  {
    id: 'cf1',
    name: 'Summer Vacation Highlights',
    thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    description: 'Montage',
    aspectRatio: '16:9',
    duration: 105, // 1m 45s in seconds
    status: 'draft',
    elements: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['vacation', 'summer', 'family']
  },
  {
    id: 'cf2',
    name: 'Product Launch Teaser',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    description: 'Trailer',
    aspectRatio: '16:9',
    duration: 30,
    status: 'published',
    elements: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['product', 'business', 'promo']
  },
  {
    id: 'cf3',
    name: 'Instagram Story Collection',
    thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    description: 'Reel',
    aspectRatio: '9:16',
    duration: 15,
    status: 'draft',
    elements: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['instagram', 'social', 'vertical']
  },
  {
    id: 'cf4',
    name: 'Brand Intro Video',
    thumbnail: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    description: 'Custom',
    aspectRatio: '16:9',
    duration: 45,
    status: 'published',
    elements: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['brand', 'intro', 'corporate']
  }
];

// Simulated API fetch
export async function getAllProjects(): Promise<CineFlowProject[]> {
  try {
    // Simulate real fetch with delay
    // const res = await fetch('/api/projects'); // Only if backend exists
    // return await res.json();

    // Simulated fallback
    return Promise.resolve(mockProjects);
  } catch (error) {
    console.warn('Using mock projects due to error:', error);
    return mockProjects;
  }
}

export async function getProjectById(id: string): Promise<CineFlowProject> {
  try {

    const res = await fetch(`${API_BASE_URL}/${id}`);

    if (!res.ok) {
      // throw new Error('Project not found');
      const project = mockProjects.find(p => p.id === id);
      if (!project) throw new Error('Not found');
      return Promise.resolve(project);
    }

    const data = await res.json();
    return data as CineFlowProject;



  } catch (error) {
    console.error(`Failed to fetch project with id: ${id}`);
    throw new Error('Project not found');
  }
}
