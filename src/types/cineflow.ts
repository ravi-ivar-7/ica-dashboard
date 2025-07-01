// Types for CineFlow editor

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3' | '21:9';

export interface AspectRatioOption {
  value: AspectRatio;
  label: string;
}


export interface CanvasElementType {
  id: string;
  type: 'image' | 'video' | 'audio' | 'text' | 'element';
  name?: string;
  src?: string;
  text?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  opacity?: number;
  startTime: number;
  duration: number;
  poster?: string; // Added for video preview
  layer?: number; // Added for z-index control
  
  // Text-specific properties
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  lineHeight?: number;
}

export interface CineFlowProject {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  aspectRatio:AspectRatio;
  duration: number;
  elements: CanvasElementType[];
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  tags: string[];
}

export interface Template {
  id: string;
  name: string;
  thumbnail: string;
  aspectRatio: AspectRatio;
  duration: number;
  elements: CanvasElementType[];
  tags: string[];
}

export interface TextStyle {
  id: string;
  name: string;
  style: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
    lineHeight?: number;
  };
}

export interface Asset {
  id: string;
  type: 'image' | 'video' | 'audio';
  name: string;
  src: string;
  duration?: string;
  poster?:string;
}

export interface Element {
  id: string;
  name: string;
  src: string;
  type: 'element';
}

