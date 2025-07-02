// export/utils/constants.ts
export const DEFAULT_RESOLUTIONS = {
  '240p': { width: 426, height: 240 },
  '360p': { width: 640, height: 360 },
  '480p': { width: 854, height: 480 },
  '720p': { width: 1280, height: 720 },
  '1080p': { width: 1920, height: 1080 },
  '2160p': { width: 3840, height: 2160 },
};


export const QUALITY_SETTINGS = {
  low: { crf: 28, preset: 'fast', jpegQuality: 0.75 },
  medium: { crf: 23, preset: 'medium', jpegQuality: 0.85 },
  high: { crf: 18, preset: 'slow', jpegQuality: 0.95 }
};

export const DEFAULT_FPS = 30;
export const DEFAULT_AUDIO_BITRATE = '192k';
export const DEFAULT_AUDIO_CODEC = 'aac';
export const DEFAULT_VIDEO_CODEC = 'libx264';
export const DEFAULT_PIX_FMT = 'yuv420p';