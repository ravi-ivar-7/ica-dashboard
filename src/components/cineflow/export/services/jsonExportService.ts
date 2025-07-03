// jsonExportService.ts
import { CineFlowProject } from '@/types/cineflow';

export const exportJson = (project: CineFlowProject): Blob => {
  try {
    if (!project || typeof project !== 'object') {
      throw new Error('Invalid project data');
    }

    const exportData = {
      metadata: {
        version: '1.0',
        createdAt: new Date().toISOString(),
        source: 'cineflow-export',
        exportedBy: 'hidden',
        locale: 'en-IN',
        exportFormat: 'json',
      },
      project: {
        id: project.id,
        name: project.name,
        description: project.description || '',
        aspectRatio: project.aspectRatio || '1:1',
        duration: project.duration || 0,
        status: project.status || 'draft',
        elements: project.elements || [],
        tags: project.tags || [],
        thumbnail: project.thumbnail || '',
        createdAt: project.createdAt || new Date().toISOString(),
        updatedAt: project.updatedAt || new Date().toISOString()
      }
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    return new Blob([jsonString], { type: 'application/json' });
  } catch (error) {
    console.error('JSON export failed:', error);
    throw new Error('Failed to create JSON export');
  }
};