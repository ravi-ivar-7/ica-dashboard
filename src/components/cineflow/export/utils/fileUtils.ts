// export/utils/fileUtils.ts
export const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const getExportFilename = (projectName: string, format: string, extension: string) => {
  return `${projectName.replace(/\s+/g, '_')}_${format}.${extension}`;
};

export const createImageZip = async (images: string[], filename: string): Promise<Blob> => {
  // In a real implementation, we would use a library like JSZip
  // This is a placeholder for the actual implementation
  console.log('Creating ZIP file with', images.length, 'images');
  return new Blob([JSON.stringify(images)], { type: 'application/zip' });
};