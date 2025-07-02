// export/services/ffmpegService.ts
import { createFFmpeg } from '@ffmpeg/ffmpeg';

let ffmpegInstance: any = null;

export const loadFFmpeg = async () => {
  if (typeof window === 'undefined') return null;
  if (ffmpegInstance) return ffmpegInstance;

  try {
    ffmpegInstance = createFFmpeg({
      log: true,
      corePath: '/ffmpeg/ffmpeg-core.js',
    });
    await ffmpegInstance.load();
    return ffmpegInstance;
  } catch (error) {
    console.error('Error loading FFmpeg:', error);
    throw error;
  }
};


// ffmpegService.ts - Safe cleanup function
export const cleanupFFmpeg = async (ffmpegInstance: any, totalFrames: number): Promise<void> => {
  if (!ffmpegInstance || !ffmpegInstance.FS) {
    console.warn('FFmpeg instance not available for cleanup');
    return;
  }

  console.log('Starting safe cleanup...');
  
  try {
    // Get list of files to clean up
    const files = ffmpegInstance.FS('readdir', '.');
    const filesToDelete: string[] = [];
    
    // Identify files to delete
    for (const file of files) {
      if (file === '.' || file === '..' || file === 'dev' || file === 'proc') {
        continue;
      }
      
      // Delete frame files, audio files, and output files
      if (file.startsWith('frame') && file.endsWith('.jpg') ||
          file === 'audio.wav' ||
          file === 'output.mp4' ||
          file === 'filelist.txt') {
        filesToDelete.push(file);
      }
    }
    
    console.log(`Found ${filesToDelete.length} files to clean up`);
    
    // Delete files in batches to avoid overwhelming the FS
    const batchSize = 10;
    let deleted = 0;
    
    for (let i = 0; i < filesToDelete.length; i += batchSize) {
      const batch = filesToDelete.slice(i, i + batchSize);
      
      for (const file of batch) {
        try {
          ffmpegInstance.FS('unlink', file);
          deleted++;
        } catch (unlinkError) {
          console.warn(`Failed to delete ${file}:`, unlinkError);
          // Continue with other files - don't let one failure stop cleanup
        }
      }
      
      // Small delay between batches to prevent overwhelming the FS
      if (i + batchSize < filesToDelete.length) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
    
    console.log(`Cleanup completed: ${deleted}/${filesToDelete.length} files deleted`);
    
  } catch (error) {
    console.warn('Error during cleanup (non-critical):', error);
    // Don't throw - cleanup errors shouldn't fail the export
  }
};

// Alternative minimal cleanup that just logs and continues
export const minimalCleanup = async (ffmpegInstance: any): Promise<void> => {
  try {
    if (ffmpegInstance && ffmpegInstance.FS) {
      const files = ffmpegInstance.FS('readdir', '.');
      console.log(`Cleanup skipped - ${files.length} files remain in FFmpeg FS`);
    }
  } catch (error) {
    console.warn('Could not check remaining files:', error);
  }
};