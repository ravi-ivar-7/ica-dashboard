/**
 * Color utility functions
 */

/**
 * Get the complement color of a given hex color
 * @param hex - Hex color string (e.g., '#ffffff')
 * @returns Complement color in RGB format
 */
export function getComplementColor(hex: string): string {
  if (!hex || hex.length < 7) return '#ffffff';
  
  const r = 255 - parseInt(hex.slice(1, 3), 16);
  const g = 255 - parseInt(hex.slice(3, 5), 16);
  const b = 255 - parseInt(hex.slice(5, 7), 16);
  
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Convert hex to RGB values
 * @param hex - Hex color string
 * @returns RGB object with r, g, b values
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Convert RGB to hex
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Hex color string
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * Check if a color is light or dark
 * @param hex - Hex color string
 * @returns True if color is light, false if dark
 */
export function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  
  // Calculate luminance
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
}