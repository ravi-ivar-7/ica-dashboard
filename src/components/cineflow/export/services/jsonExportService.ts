// export/services/jsonExportService.ts
import { CineFlowProject } from '@/types/cineflow';

export const exportJson = (project: CineFlowProject): Blob => {
  try {
    const exportData = {
      meta: {
        version: '1.0',
        createdAt: new Date().toISOString(),
      },
      project: {
        ...project,
        // Add any specific transformations here
      }
    };

    const jsonString = JSON.stringify(exportData, null, 2);

    return new Blob([jsonString], { type: 'application/json' });
  } catch (error) {
    console.error('JSON export failed:', error);
    throw new Error('Failed to create JSON export');
  }
};