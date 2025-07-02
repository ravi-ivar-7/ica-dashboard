// export/types/exportTypes.ts
export type ExportFormat = 'video' | 'image-sequence' | 'json';
export type ExportDestination = 'download' | 'assets' | 'cloud';
export type ExportQuality = 'low' | 'medium' | 'high';
export type ExportResolution = '240p' | '360p' | '480p' | '720p' | '1080p' | '2160p';
import { CineFlowProject } from "@/types/cineflow";


export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: CineFlowProject;
}

export interface ExportConfig {
  format: ExportFormat;
  destination: ExportDestination;
  resolution: ExportResolution;
  quality: ExportQuality;
}

export interface ExportProgressTypes {
  percentage: number;
  message: string;
}
