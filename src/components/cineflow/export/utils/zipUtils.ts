// utils/zipUtils.ts
import JSZip from 'jszip';

interface ZipCreationOptions {
  compressionLevel?: number;
  folderName?: string;
}

export const createImageZip = async (
  images: Blob[],
  filename: string,
  options: ZipCreationOptions = {}
): Promise<Blob> => {
  try {
    const zip = new JSZip();
    const folder = options.folderName 
      ? zip.folder(options.folderName) || zip 
      : zip;

    // Add each image to the ZIP
    await Promise.all(images.map(async (image, index) => {
      try {
        const frameNumber = String(index).padStart(6, '0');
        const arrayBuffer = await image.arrayBuffer();
        folder.file(`frame_${frameNumber}.png`, arrayBuffer);
      } catch (error) {
        console.error(`Error adding frame ${index} to ZIP:`, error);
        throw new Error(`Failed to add frame ${index} to archive`);
      }
    }));

    // Generate the ZIP file
    const content = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { 
        level: options.compressionLevel ?? 6 
      }
    });

    // Verify the ZIP file
    if (content.size < 100 && images.length > 0) {
      throw new Error('Generated ZIP file appears corrupted');
    }

    return content;
  } catch (error) {
    console.error('ZIP creation failed:', error);
    throw new Error('Failed to create valid ZIP archive');
  }
};

export const verifyZipIntegrity = async (zipBlob: Blob): Promise<boolean> => {
  try {
    const zip = new JSZip();
    const content = await zip.loadAsync(zipBlob);
    const files = Object.keys(content.files);
    
    return files.length > 0 && 
           files.every(file => content.files[file].dir || file.endsWith('.png'));
  } catch (error) {
    console.error('ZIP verification failed:', error);
    return false;
  }
};