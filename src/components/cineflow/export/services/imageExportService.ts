// export/services/imageExportService.ts (updated)
import { renderFrame } from '../utils/canvasUtils';
import { CineFlowProject } from '@/types/cineflow';
import { ExportConfig, ExportProgressTypes } from '../types/exportTypes';
import { DEFAULT_RESOLUTIONS, DEFAULT_FPS } from '../utils/constants';

export const exportImageSequence = async (
  project: CineFlowProject,
  config: ExportConfig,
  updateProgress: (progress: ExportProgressTypes) => void
) => {
  const { resolution } = config;
  updateProgress({ percentage: 10, message: 'Preparing image sequence...' });
  
  const canvas = document.createElement('canvas');
  const aspectRatio = project.aspectRatio.split(':').map(Number);
  const aspectWidth = aspectRatio[0];
  const aspectHeight = aspectRatio[1];
  
  const { height } = DEFAULT_RESOLUTIONS[resolution];
  const width = (aspectWidth / aspectHeight) * height;
  
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');
  
  const fps = DEFAULT_FPS;
  const totalFrames = Math.ceil(project.duration * fps);
  
  updateProgress({ percentage: 15, message: 'Rendering frames...' });
  const frames: string[] = [];
  
  for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
    const time = frameIndex / fps;
    await renderFrame(time, canvas, ctx, project.elements);
    frames.push(canvas.toDataURL('image/png'));
    
    const progress = Math.floor((frameIndex / totalFrames) * 80);
    updateProgress({ percentage: 15 + progress, message: `Rendering frame ${frameIndex + 1}/${totalFrames}...` });
  }
  
  updateProgress({ percentage: 95, message: 'Finalizing export...' });
  return frames;
};