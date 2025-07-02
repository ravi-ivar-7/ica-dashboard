// export/services/jsonExportService.ts
import { CineFlowProject } from '@/types/cineflow';

export const exportJson = (project: CineFlowProject) => {
  const projectJson = JSON.stringify(project, null, 2);
  return new Blob([projectJson], { type: 'application/json' });
};