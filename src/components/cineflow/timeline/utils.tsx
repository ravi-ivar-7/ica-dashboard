// Timeline utility functions for consistent behavior across components

export interface ScrollControlOptions {
  horizontal?: boolean;
  vertical?: boolean;
  container?: HTMLElement | null;
}

/**
 * Disable scrolling on specified axes
 */
export const disableScrolling = (options: ScrollControlOptions = {}) => {
  const { horizontal = false, vertical = false, container } = options;
  
  if (container) {
    if (horizontal) {
      container.style.overflowX = 'hidden';
    }
    if (vertical) {
      container.style.overflowY = 'hidden';
    }
  }
  
  // Disable body scrolling
  if (horizontal) {
    document.body.style.overflowX = 'hidden';
    document.body.style.touchAction = 'pan-y pinch-zoom';
  }
  if (vertical) {
    document.body.style.overflowY = 'hidden';
    document.body.style.touchAction = 'pan-x pinch-zoom';
  }
  if (horizontal && vertical) {
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  }
};

/**
 * Re-enable scrolling
 */
export const enableScrolling = (container?: HTMLElement | null) => {
  if (container) {
    container.style.overflowX = 'auto';
    container.style.overflowY = 'auto';
  }
  
  // Re-enable body scrolling
  document.body.style.overflowX = '';
  document.body.style.overflowY = '';
  document.body.style.overflow = '';
  document.body.style.touchAction = '';
};

/**
 * Get position from mouse or touch event
 */
export const getEventPosition = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
  if ('touches' in e) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  return { x: e.clientX, y: e.clientY };
};

/**
 * Format time in MM:SS.MS format
 */
export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const milliseconds = Math.floor((time % 1) * 100);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
};

/**
 * Parse time string in MM:SS.MS format
 */
export const parseTime = (timeStr: string): number | null => {
  const regex = /^(\d{1,2}):(\d{1,2})(?:\.(\d{1,2}))?$/;
  const match = timeStr.match(regex);
  
  if (!match) return null;
  
  const minutes = parseInt(match[1]) || 0;
  const seconds = parseInt(match[2]) || 0;
  const milliseconds = parseInt(match[3]) || 0;
  
  // Validate ranges
  if (seconds >= 60 || milliseconds >= 100) return null;
  
  return minutes * 60 + seconds + milliseconds / 100;
};

/**
 * Convert time to position on timeline
 */
export const timeToPosition = (time: number, duration: number, timelineWidth: number): number => {
  if (timelineWidth === 0 || duration === 0) return 0;
  return Math.max(0, (time / duration) * timelineWidth);
};

/**
 * Convert position to time on timeline
 */
export const positionToTime = (position: number, duration: number, timelineWidth: number): number => {
  if (timelineWidth === 0) return 0;
  return Math.max(0, (position / timelineWidth) * duration);
};

/**
 * Clamp value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Generate timeline markers based on duration
 */
export const generateTimelineMarkers = (duration: number): number[] => {
  const markers: number[] = [];
  const markerInterval = duration > 60 ? 10 : duration > 30 ? 5 : 1;
  
  for (let i = 0; i <= duration; i += markerInterval) {
    markers.push(i);
  }
  
  return markers;
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function for performance optimization
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};