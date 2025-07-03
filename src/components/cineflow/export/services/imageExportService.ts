// services/imageExportService.ts
import { renderFrame } from '../utils/canvasUtils';
import { CineFlowProject } from '@/types/cineflow';
import { ExportConfig, ExportProgressTypes } from '../types/exportTypes';
import { DEFAULT_RESOLUTIONS, DEFAULT_FPS } from '../utils/constants';
import { createImageZip ,verifyZipIntegrity } from '../utils/zipUtils'; 

export interface ImageSequenceResult {
  zipBlob: Blob;
  frameCount: number;
  resolution: { width: number; height: number };
}

export const exportImageSequence = async (
  project: CineFlowProject,
  config: ExportConfig,
  updateProgress: (progress: ExportProgressTypes) => void
): Promise<ImageSequenceResult> => {
  const { resolution } = config;
  
  // Setup canvas
  const canvas = document.createElement('canvas');
  const [aspectWidth, aspectHeight] = project.aspectRatio.split(':').map(Number);
  const { height } = DEFAULT_RESOLUTIONS[resolution];
  const width = Math.round((aspectWidth / aspectHeight) * height);
  
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Calculate frame info
  const fps = DEFAULT_FPS;
  const totalFrames = Math.ceil(project.duration * fps);
  const frames: Blob[] = [];
  
  updateProgress({ percentage: 0, message: 'Preparing export...' });

  try {
    updateProgress({ percentage: 5, message: `Rendering ${totalFrames} frames...` });

    // Render all frames
    for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
      try {
        const time = frameIndex / fps;
        ctx.clearRect(0, 0, width, height);
        
        // Render the frame
        await renderFrame(time, canvas, ctx, project.elements);
        
        // Convert to PNG blob
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            blob => blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')),
            'image/png',
            1.0 // Maximum quality
          );
        });

        frames.push(blob);

        // Update progress (5-85% for rendering)
        const progress = 5 + (frameIndex / totalFrames) * 80;
        updateProgress({ 
          percentage: Math.min(85, Math.floor(progress)),
          message: `Rendered frame ${frameIndex + 1}/${totalFrames}`
        });

        // Prevent UI freeze
        if (frameIndex % 5 === 0) await new Promise(r => setTimeout(r, 0));
        
      } catch (frameError) {
        console.error(`Error rendering frame ${frameIndex}:`, frameError);
        // Continue with next frame
        updateProgress({
          percentage: 5 + (frameIndex / totalFrames) * 80,
          message: `Skipped frame ${frameIndex + 1} due to error`
        });
      }
    }

    if (frames.length === 0) {
      throw new Error('No frames were successfully rendered');
    }

    // Create ZIP archive (85-95%)
    updateProgress({ percentage: 85, message: 'Creating ZIP archive...' });
    const zipBlob = await createImageZip(frames, project.name, {
      compressionLevel: 6,
      folderName: 'frames'
    });

    // Final verification (95-100%)
    updateProgress({ percentage: 95, message: 'Verifying export...' });
    const isValid = await verifyZipIntegrity(zipBlob);
    if (!isValid) {
      throw new Error('Generated ZIP file failed verification');
    }

    updateProgress({ percentage: 100, message: 'Export complete!' });
    
    return {
      zipBlob,
      frameCount: frames.length,
      resolution: { width, height }
    };

  } catch (error) {
    updateProgress({ 
      percentage: 100, 
      message: 'Export failed'
    });
    throw error;
  }
};