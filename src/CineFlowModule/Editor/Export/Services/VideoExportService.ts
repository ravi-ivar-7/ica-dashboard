// export/services/videoExportService.ts (fixed)
import { renderFrame } from '../Utils/canvasUtils';
import { processAudio } from './AudioService';
import { loadFFmpeg, cleanupFFmpeg } from './FfmpegService';
import { CineFlowProject } from '@/CineFlowModule/Types/Cineflow';
import { ExportConfig, ExportProgressTypes } from '../Types/ExportTypes';
import {
  DEFAULT_RESOLUTIONS,
  QUALITY_SETTINGS,
  DEFAULT_FPS,
  DEFAULT_AUDIO_BITRATE,
  DEFAULT_AUDIO_CODEC,
  DEFAULT_VIDEO_CODEC,
  DEFAULT_PIX_FMT
} from '../Utils/constants';

// More robust base64 to Uint8Array conversion
function base64ToUint8Array(base64: string): Uint8Array {
  try {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (error) {
    console.error('Failed to convert base64 to Uint8Array:', error);
    throw new Error('Invalid base64 data');
  }
}

// Validate FFmpeg instance before operations
function validateFFmpegInstance(ffmpeg: any): void {
  if (!ffmpeg || !ffmpeg.FS) {
    throw new Error('FFmpeg instance is not properly initialized');
  }
}

export const exportVideo = async (
  project: CineFlowProject,
  config: ExportConfig,
  updateProgress: (progress: ExportProgressTypes) => void
) => {

  const { resolution, quality } = config;
  let ffmpegInstance: any;

  try {
    ffmpegInstance = await loadFFmpeg();
    validateFFmpegInstance(ffmpegInstance);
  } catch (error) {
    console.error('Failed to load FFmpeg:', error);
    throw new Error('Failed to initialize FFmpeg. Please try again.');
  }

  updateProgress({ percentage: 5, message: 'Initializing export...' });

  // Create a canvas for rendering frames
  const canvas = document.createElement('canvas');
  const aspectRatio = project.aspectRatio.split(':').map(Number);
  const aspectWidth = aspectRatio[0];
  const aspectHeight = aspectRatio[1];

  const { height } = DEFAULT_RESOLUTIONS[resolution];
  const width = Math.round((aspectWidth / aspectHeight) * height);

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Could not get canvas context');

  // Determine frame rate and duration
  const fps = DEFAULT_FPS;
  const totalFrames = Math.ceil(project.duration * fps);
  const qualitySettings = QUALITY_SETTINGS[quality];

  updateProgress({ percentage: 10, message: 'Rendering frames...' });

  // Clear FFmpeg filesystem first
  try {
    const existingFiles = ffmpegInstance.FS('readdir', '.');
    for (const file of existingFiles) {
      if (file !== '.' && file !== '..' && file !== 'dev' && file !== 'proc') {
        try {
          ffmpegInstance.FS('unlink', file);
        } catch (e) {
          // Ignore errors when cleaning up
        }
      }
    }
  } catch (e) {
    console.warn('Could not clean existing files:', e);
  }

  // Render frames with improved error handling
  const frameFiles: string[] = [];
  const maxRetries = 3;

  for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
    const time = frameIndex / fps;

    try {
      await renderFrame(time, canvas, ctx, project.elements);
    } catch (renderError) {
      console.error(`Failed to render frame ${frameIndex}:`, renderError);
      throw new Error(`Failed to render frame ${frameIndex}: ${renderError}`);
    }

    // Convert canvas to blob first, then to array buffer for better reliability
    let imageBytes: Uint8Array;

    try {
      // Use canvas.toBlob for better memory management
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        }, 'image/jpeg', qualitySettings.jpegQuality);
      });

      const arrayBuffer = await blob.arrayBuffer();
      imageBytes = new Uint8Array(arrayBuffer);
    } catch (blobError) {
      console.error(`Failed to create image data for frame ${frameIndex}:`, blobError);

      // Fallback to dataURL method
      try {
        const imageData = canvas.toDataURL('image/jpeg', qualitySettings.jpegQuality);
        const base64Data = imageData.split(',')[1];
        imageBytes = base64ToUint8Array(base64Data);
      } catch (fallbackError) {
        throw new Error(`Failed to create image data for frame ${frameIndex}: ${fallbackError}`);
      }
    }

    // Validate image data
    if (!imageBytes || imageBytes.length === 0) {
      throw new Error(`Generated empty image data for frame ${frameIndex}`);
    }

    const frameFileName = `frame${String(frameIndex).padStart(6, '0')}.jpg`;

    // Write frame with improved error handling - avoid analyzePath which seems to be the issue
    let writeSuccess = false;
    let lastError: any;

    for (let retry = 0; retry < maxRetries; retry++) {
      try {
        // Validate FFmpeg instance before each write
        validateFFmpegInstance(ffmpegInstance);

        // Write the file
        ffmpegInstance.FS('writeFile', frameFileName, imageBytes);

        // Instead of analyzePath, try to read a small portion to verify write success
        // This is more reliable than analyzePath which seems to cause the FS error
        try {
          const testRead = ffmpegInstance.FS('readFile', frameFileName, { flags: 'r' });
          if (!testRead || testRead.length === 0) {
            throw new Error('File appears to be empty after write');
          }

          // Verify the file size matches what we wrote
          if (testRead.length !== imageBytes.length) {
            throw new Error(`File size mismatch: expected ${imageBytes.length}, got ${testRead.length}`);
          }
        } catch (readError) {
          throw new Error(`File verification failed: ${readError}`);
        }

        frameFiles.push(frameFileName);
        writeSuccess = true;
        break;

      } catch (writeError) {
        lastError = writeError;
        console.warn(`Attempt ${retry + 1} failed to write frame ${frameIndex}:`, writeError);

        // Clean up failed file if it exists - avoid analyzePath here too
        try {
          ffmpegInstance.FS('unlink', frameFileName);
        } catch (cleanupError) {
          // Ignore cleanup errors - file might not exist
        }

        // Wait before retry with exponential backoff
        if (retry < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 200 * (retry + 1)));
        }
      }
    }

    if (!writeSuccess) {
      const errorMessage = lastError instanceof Error ? lastError.message : String(lastError);
      throw new Error(`Failed to write frame ${frameIndex} after ${maxRetries} attempts: ${errorMessage}`);
    }

    const frameProgress = Math.floor((frameIndex / totalFrames) * 60);
    updateProgress({
      percentage: 10 + frameProgress,
      message: `Rendered frame ${frameIndex + 1}/${totalFrames}...`
    });
  }

  console.log(`Successfully rendered ${frameFiles.length} frames`);

  // Verify all frames exist - use readdir instead of analyzePath
  let verifiedFrames = 0;
  try {
    const allFiles = ffmpegInstance.FS('readdir', '.');
    const frameFileSet = new Set(frameFiles);

    for (const file of allFiles) {
      if (frameFileSet.has(file)) {
        verifiedFrames++;
      }
    }
  } catch (listError) {
    console.warn('Could not verify frames through directory listing:', listError);
    // Assume all frames exist if we can't verify
    verifiedFrames = frameFiles.length;
  }

  if (verifiedFrames < frameFiles.length) {
    console.warn(`Only ${verifiedFrames}/${frameFiles.length} frames verified, but continuing...`);
  } else {
    console.log(`All ${verifiedFrames} frames verified successfully`);
  }

  updateProgress({ percentage: 70, message: 'Processing audio...' });
  const audioBlob = await processAudio(project.elements, project.duration);
  let hasAudio = false;

  if (audioBlob) {
    try {
      const audioArrayBuffer = await audioBlob.arrayBuffer();
      ffmpegInstance.FS('writeFile', 'audio.wav', new Uint8Array(audioArrayBuffer));

      // Verify audio file exists using readdir instead of analyzePath
      let audioExists = false;
      try {
        const files = ffmpegInstance.FS('readdir', '.');
        audioExists = files.includes('audio.wav');
      } catch (listError) {
        console.warn('Could not verify audio file:', listError);
        // Try to read the file as fallback
        try {
          ffmpegInstance.FS('readFile', 'audio.wav');
          audioExists = true;
        } catch (readError) {
          audioExists = false;
        }
      }

      if (audioExists) {
        hasAudio = true;
        updateProgress({ percentage: 75, message: 'Audio processed' });
      } else {
        console.warn('Audio file was not created successfully');
      }
    } catch (audioError) {
      console.warn('Failed to process audio:', audioError);
      // Continue without audio
    }
  }

  updateProgress({ percentage: 80, message: 'Encoding video...' });

  if (frameFiles.length === 0) {
    throw new Error('No frames were rendered successfully');
  }
  let args: string[] = [];

  if (hasAudio) {
    args = [
      '-framerate', `${fps}`,
      '-pattern_type', 'glob',
      '-i', 'frame*.jpg',
      '-i', 'audio.wav',
      '-c:v', DEFAULT_VIDEO_CODEC,
      '-pix_fmt', DEFAULT_PIX_FMT,
      '-preset', qualitySettings.preset,
      '-crf', String(qualitySettings.crf),
      '-c:a', DEFAULT_AUDIO_CODEC,
      '-b:a', DEFAULT_AUDIO_BITRATE,
      '-shortest',
      '-movflags', '+faststart',
      '-y',
      'output.mp4'
    ];
  } else {
    args = [
      '-framerate', `${fps}`,
      '-pattern_type', 'glob',
      '-i', 'frame*.jpg',
      '-c:v', DEFAULT_VIDEO_CODEC,
      '-pix_fmt', DEFAULT_PIX_FMT,
      '-preset', qualitySettings.preset,
      '-crf', String(qualitySettings.crf),
      '-movflags', '+faststart',
      '-y',
      'output.mp4'
    ];
  }

  try {
    await ffmpegInstance.run(...args);

    updateProgress({ percentage: 95, message: 'Finalizing export...' });

    // Check if output file exists - use readdir 
    let outputExists = false;
    try {
      const files = ffmpegInstance.FS('readdir', '.');
      outputExists = files.includes('output.mp4');
    } catch (listError) {
      console.warn('Could not list files to check output:', listError);
      // Try to read the file directly as fallback
      try {
        ffmpegInstance.FS('readFile', 'output.mp4');
        outputExists = true;
      } catch (readError) {
        outputExists = false;
      }
    }

    if (!outputExists) {
      throw new Error('Output file was not created by FFmpeg');
    }

    const data = ffmpegInstance.FS('readFile', 'output.mp4');

    if (!data || data.length === 0) {
      throw new Error('Output file is empty');
    }

    const blob = new Blob([data.buffer], { type: 'video/mp4' });

    // Safer cleanup that won't throw errors
    try {
      await cleanupFFmpeg(ffmpegInstance, totalFrames);
    } catch (cleanupError) {
      console.warn('Cleanup failed, but video export succeeded:', cleanupError);
      // Don't throw - the video export was successful
    }

    updateProgress({ percentage: 100, message: 'Export complete' });

    return blob;

  } catch (ffmpegError) {
    console.error('FFmpeg encoding failed:', ffmpegError);

    // List available files for debugging
    try {
      const files = ffmpegInstance.FS('readdir', '.');
      console.log('Available files after FFmpeg failure:', files);
    } catch (e) {
      console.error('Could not list files:', e);
    }

    // Safe cleanup that won't throw additional errors
    try {
      await cleanupFFmpeg(ffmpegInstance, totalFrames);
    } catch (cleanupError) {
      console.warn('Cleanup failed after encoding error:', cleanupError);
    }

    const errorMessage = ffmpegError instanceof Error ? ffmpegError.message : String(ffmpegError);
    throw new Error(`Video encoding failed: ${errorMessage}`);
  }
};