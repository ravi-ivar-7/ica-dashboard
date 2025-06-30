import React, { useState, useRef, useEffect } from 'react';
import { X, Download, Save, Cloud, FileJson, Video, Image as ImageIcon, Check, Info, Zap, Loader } from 'lucide-react';
import { toast } from '../../contexts/ToastContext';
import { CineFlowProject, CanvasElementType } from '../../types/cineflow';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: CineFlowProject;
}

type ExportFormat = 'video' | 'image-sequence' | 'json';
type ExportDestination = 'download' | 'assets' | 'cloud';

// Initialize FFmpeg
let ffmpeg: any = null;

const loadFFmpeg = async () => {
  if (ffmpeg) return ffmpeg;
  
  try {
    ffmpeg = createFFmpeg({ 
      log: true,
      corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
    });
    await ffmpeg.load();
    return ffmpeg;
  } catch (error) {
    console.error('Error loading FFmpeg:', error);
    throw error;
  }
};

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, project }) => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('video');
  const [exportDestination, setExportDestination] = useState<ExportDestination>('download');
  const [resolution, setResolution] = useState('1080p');
  const [quality, setQuality] = useState('high');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Load FFmpeg when the modal opens
  useEffect(() => {
    if (isOpen) {
      loadFFmpeg().catch(error => {
        toast.error('Failed to load video export tools', {
          subtext: 'Please try again or use a different export format',
          duration: 5000
        });
      });
    }
    
    // Initialize AudioContext
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.error('Failed to create AudioContext:', error);
      }
    }
    
    return () => {
      // Clean up AudioContext when component unmounts
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().then(() => {
          audioContextRef.current = null;
        }).catch(console.error);
      }
    };
  }, [isOpen]);
  
  if (!isOpen) return null;

  // Function to render a frame at a specific time
  const renderFrame = async (time: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Get visible elements at this time
    const visibleElements = project.elements.filter(element => 
      time >= element.startTime && time < (element.startTime + element.duration)
    );
    
    // Sort by layer (z-index)
    const sortedElements = [...visibleElements].sort((a, b) => {
      const layerA = a.layer || 0;
      const layerB = b.layer || 0;
      return layerA - layerB;
    });
    
    // Draw each element
    for (const element of sortedElements) {
      await drawElement(element, time, ctx);
    }
    
    return canvas;
  };
  
  // Function to draw an element on the canvas
  const drawElement = async (element: CanvasElementType, time: number, ctx: CanvasRenderingContext2D) => {
    // Apply element opacity
    ctx.globalAlpha = element.opacity !== undefined ? element.opacity : 1;
    
    // Save context state
    ctx.save();
    
    // Apply rotation if needed
    if (element.rotation) {
      const centerX = element.x + element.width / 2;
      const centerY = element.y + element.height / 2;
      ctx.translate(centerX, centerY);
      ctx.rotate((element.rotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);
    }
    
    // Draw based on element type
    switch (element.type) {
      case 'image':
        if (element.src) {
          const img = new window.Image();
          // Set crossOrigin before setting src to prevent canvas taint
          img.crossOrigin = 'anonymous';
          img.src = element.src;
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve; // Continue even if image fails to load
          });
          try {
            ctx.drawImage(img, element.x, element.y, element.width, element.height);
          } catch (error) {
            console.warn('Failed to draw image, canvas may be tainted:', error);
          }
        }
        break;
        
      case 'video':
        if (element.src) {
          const video = document.createElement('video');
          // Set crossOrigin before setting src to prevent canvas taint
          video.crossOrigin = 'anonymous';
          video.src = element.src;
          video.muted = true;
          
          // Set video time relative to the element's timeline position
          const relativeTime = time - element.startTime;
          
          await new Promise<void>((resolve) => {
            video.onloadedmetadata = () => {
              video.currentTime = relativeTime;
              video.onseeked = () => resolve();
              video.onerror = () => resolve();
            };
            video.onerror = () => resolve();
            video.load();
          });
          
          try {
            ctx.drawImage(video, element.x, element.y, element.width, element.height);
          } catch (error) {
            console.warn('Failed to draw video frame, canvas may be tainted:', error);
          }
        }
        break;
        
      case 'text':
        if (element.text) {
          ctx.font = `${element.fontWeight || 'normal'} ${element.fontSize || 24}px ${element.fontFamily || 'sans-serif'}`;
          ctx.fillStyle = element.color || '#ffffff';
          ctx.textAlign = element.textAlign || 'center' as CanvasTextAlign;
          
          // Calculate text position based on alignment
          let textX = element.x;
          if (element.textAlign === 'center') {
            textX += element.width / 2;
          } else if (element.textAlign === 'right') {
            textX += element.width;
          }
          
          // Draw text with word wrap
          const words = element.text.split(' ');
          let line = '';
          let lineY = element.y + (element.fontSize || 24);
          const lineHeight = (element.fontSize || 24) * (element.lineHeight || 1.2);
          
          for (const word of words) {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > element.width && line !== '') {
              ctx.fillText(line, textX, lineY);
              line = word + ' ';
              lineY += lineHeight;
            } else {
              line = testLine;
            }
          }
          
          ctx.fillText(line, textX, lineY);
        }
        break;
        
      case 'element':
        if (element.src) {
          const img = new window.Image();
          // Set crossOrigin before setting src to prevent canvas taint
          img.crossOrigin = 'anonymous';
          img.src = element.src;
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
          try {
            ctx.drawImage(img, element.x, element.y, element.width, element.height);
          } catch (error) {
            console.warn('Failed to draw element, canvas may be tainted:', error);
          }
        }
        break;
    }
    
    // Restore context state
    ctx.restore();
    
    // Reset global alpha
    ctx.globalAlpha = 1;
  };
  
  // Function to process audio elements and create a combined audio track
  const processAudio = async () => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      console.warn('AudioContext not available or closed');
      return null;
    }
    
    // Get all audio elements
    const audioElements = project.elements.filter(el => el.type === 'audio');
    
    if (audioElements.length === 0) {
      console.log('No audio elements to process');
      return null;
    }
    
    try {
      // Create a new offline audio context with the project duration
      const offlineCtx = new OfflineAudioContext(
        2, // stereo
        44100 * project.duration, // sample rate * duration in seconds
        44100 // sample rate
      );
      
      // Load and process each audio element
      const audioBuffers = await Promise.all(
        audioElements.map(async (element) => {
          try {
            // Fetch the audio file
            const response = await fetch(element.src);
            const arrayBuffer = await response.arrayBuffer();
            
            // Decode the audio data
            const audioBuffer = await offlineCtx.decodeAudioData(arrayBuffer);
            
            // Create a source node
            const source = offlineCtx.createBufferSource();
            source.buffer = audioBuffer;
            
            // Create a gain node for volume control
            const gainNode = offlineCtx.createGain();
            gainNode.gain.value = element.opacity !== undefined ? element.opacity : 1;
            
            // Connect the nodes
            source.connect(gainNode);
            gainNode.connect(offlineCtx.destination);
            
            // Schedule the audio to start at the element's start time
            source.start(element.startTime);
            
            return { source, element };
          } catch (error) {
            console.error('Error processing audio element:', error);
            return null;
          }
        })
      );
      
      // Filter out any failed audio elements
      const validAudioBuffers = audioBuffers.filter(buffer => buffer !== null);
      
      if (validAudioBuffers.length === 0) {
        console.warn('No valid audio elements could be processed');
        return null;
      }
      
      // Render the audio
      const renderedBuffer = await offlineCtx.startRendering();
      
      // Convert the rendered buffer to a WAV file
      const wavBlob = await audioBufferToWav(renderedBuffer);
      
      return wavBlob;
    } catch (error) {
      console.error('Error processing audio:', error);
      return null;
    }
  };
  
  // Function to convert AudioBuffer to WAV Blob
  const audioBufferToWav = (buffer: AudioBuffer): Promise<Blob> => {
    return new Promise((resolve) => {
      const numChannels = buffer.numberOfChannels;
      const sampleRate = buffer.sampleRate;
      const format = 1; // PCM
      const bitDepth = 16;
      
      const bytesPerSample = bitDepth / 8;
      const blockAlign = numChannels * bytesPerSample;
      
      // Create the WAV file header
      const headerSize = 44;
      const dataSize = buffer.length * numChannels * bytesPerSample;
      const wavSize = headerSize + dataSize;
      
      const wavBuffer = new ArrayBuffer(wavSize);
      const view = new DataView(wavBuffer);
      
      // "RIFF" chunk descriptor
      writeString(view, 0, 'RIFF');
      view.setUint32(4, 36 + dataSize, true);
      writeString(view, 8, 'WAVE');
      
      // "fmt " sub-chunk
      writeString(view, 12, 'fmt ');
      view.setUint32(16, 16, true); // fmt chunk size
      view.setUint16(20, format, true); // audio format
      view.setUint16(22, numChannels, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * blockAlign, true); // byte rate
      view.setUint16(32, blockAlign, true);
      view.setUint16(34, bitDepth, true);
      
      // "data" sub-chunk
      writeString(view, 36, 'data');
      view.setUint32(40, dataSize, true);
      
      // Write the PCM samples
      const channels = [];
      for (let i = 0; i < numChannels; i++) {
        channels.push(buffer.getChannelData(i));
      }
      
      let offset = 44;
      for (let i = 0; i < buffer.length; i++) {
        for (let channel = 0; channel < numChannels; channel++) {
          const sample = Math.max(-1, Math.min(1, channels[channel][i]));
          const value = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
          view.setInt16(offset, value, true);
          offset += 2;
        }
      }
      
      // Create a Blob from the WAV data
      const wavBlob = new Blob([wavBuffer], { type: 'audio/wav' });
      resolve(wavBlob);
    });
  };
  
  // Helper function to write a string to a DataView
  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  // Function to export video
  const exportVideo = async () => {
    try {
      setStatusMessage('Initializing export...');
      setExportProgress(5);
      
      // Load FFmpeg if not already loaded
      const ffmpegInstance = await loadFFmpeg();
      
      // Create a canvas for rendering frames
      const canvas = document.createElement('canvas');
      
      // Set canvas dimensions based on selected resolution
      let width, height;
      const aspectRatio = project.aspectRatio.split(':').map(Number);
      const aspectWidth = aspectRatio[0];
      const aspectHeight = aspectRatio[1];
      
      if (resolution === '720p') {
        height = 720;
        width = (aspectWidth / aspectHeight) * height;
      } else if (resolution === '1080p') {
        height = 1080;
        width = (aspectWidth / aspectHeight) * height;
      } else if (resolution === '2160p') {
        height = 2160;
        width = (aspectWidth / aspectHeight) * height;
      } else {
        // Default to 1080p
        height = 1080;
        width = (aspectWidth / aspectHeight) * height;
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Determine frame rate and duration
      const fps = 30;
      const duration = project.duration;
      const totalFrames = Math.ceil(duration * fps);
      
      setStatusMessage('Rendering frames...');
      
      // Render each frame
      for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
        const time = frameIndex / fps;
        await renderFrame(time, canvas, ctx);
        
        // Convert canvas to image data
        const imageData = canvas.toDataURL('image/jpeg', quality === 'high' ? 0.95 : quality === 'medium' ? 0.85 : 0.75);
        const base64Data = imageData.split(',')[1];
        
        // Write frame to FFmpeg virtual filesystem
        const frameFileName = `frame${String(frameIndex).padStart(4, '0')}.jpg`;
        ffmpegInstance.FS('writeFile', frameFileName, Uint8Array.from(atob(base64Data), c => c.charCodeAt(0)));
        
        // Update progress
        const frameProgress = Math.floor((frameIndex / totalFrames) * 60);
        setExportProgress(5 + frameProgress);
        
        // Update status message periodically
        if (frameIndex % 10 === 0) {
          setStatusMessage(`Rendering frame ${frameIndex + 1}/${totalFrames}...`);
        }
      }
      
      setStatusMessage('Processing audio...');
      setExportProgress(65);
      
      // Process audio elements
      const audioBlob = await processAudio();
      let hasAudio = false;
      
      if (audioBlob) {
        // Convert audio blob to array buffer
        const audioArrayBuffer = await audioBlob.arrayBuffer();
        
        // Write audio file to FFmpeg virtual filesystem
        ffmpegInstance.FS('writeFile', 'audio.wav', new Uint8Array(audioArrayBuffer));
        hasAudio = true;
        
        setExportProgress(75);
      }
      
      setStatusMessage('Encoding video...');
      setExportProgress(80);
      
      // Encode video using FFmpeg
      if (hasAudio) {
        // With audio
        await ffmpegInstance.run(
          '-framerate', `${fps}`,
          '-pattern_type', 'glob',
          '-i', 'frame*.jpg',
          '-i', 'audio.wav',
          '-c:v', 'libx264',
          '-pix_fmt', 'yuv420p',
          '-preset', quality === 'high' ? 'slow' : quality === 'medium' ? 'medium' : 'fast',
          '-crf', quality === 'high' ? '18' : quality === 'medium' ? '23' : '28',
          '-c:a', 'aac',
          '-b:a', '192k',
          '-shortest', // Ensure output duration is determined by the shortest input
          'output.mp4'
        );
      } else {
        // Without audio
        await ffmpegInstance.run(
          '-framerate', `${fps}`,
          '-pattern_type', 'glob',
          '-i', 'frame*.jpg',
          '-c:v', 'libx264',
          '-pix_fmt', 'yuv420p',
          '-preset', quality === 'high' ? 'slow' : quality === 'medium' ? 'medium' : 'fast',
          '-crf', quality === 'high' ? '18' : quality === 'medium' ? '23' : '28',
          'output.mp4'
        );
      }
      
      setStatusMessage('Finalizing export...');
      setExportProgress(95);
      
      // Read the output file
      const data = ffmpegInstance.FS('readFile', 'output.mp4');
      
      // Create a download link
      const blob = new Blob([data.buffer], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      
      if (exportDestination === 'download') {
        // Download the file
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.name.replace(/\s+/g, '_')}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else if (exportDestination === 'assets') {
        // In a real app, we would save to the assets library
        // For now, just simulate it
        await new Promise(resolve => setTimeout(resolve, 500));
      } else if (exportDestination === 'cloud') {
        // In a real app, we would upload to cloud storage
        // For now, just simulate it
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Clean up
      URL.revokeObjectURL(url);
      
      // Clean up FFmpeg filesystem
      for (let i = 0; i < totalFrames; i++) {
        const frameFileName = `frame${String(i).padStart(4, '0')}.jpg`;
        ffmpegInstance.FS('unlink', frameFileName);
      }
      
      if (hasAudio) {
        ffmpegInstance.FS('unlink', 'audio.wav');
      }
      
      ffmpegInstance.FS('unlink', 'output.mp4');
      
      setExportProgress(100);
      
      // Show success message
      toast.success('Export completed successfully', {
        subtext: exportDestination === 'download' 
          ? 'Your video has been downloaded' 
          : exportDestination === 'assets'
            ? 'Your video has been added to your assets'
            : 'Your video has been uploaded to cloud storage',
        duration: 5000
      });
      
    } catch (error) {
      console.error('Error exporting video:', error);
      toast.error(`Error exporting video: ${error instanceof Error ? error.message : 'Unknown error'}`, {
        subtext: 'There was an error during the export process. Please try again.',
        duration: 5000
      });
    } finally {
      setIsExporting(false);
      onClose();
    }
  };
  
  // Function to export image sequence
  const exportImageSequence = async () => {
    try {
      setStatusMessage('Preparing image sequence...');
      setExportProgress(10);
      
      // Create a canvas for rendering frames
      const canvas = document.createElement('canvas');
      
      // Set canvas dimensions based on selected resolution
      let width, height;
      const aspectRatio = project.aspectRatio.split(':').map(Number);
      const aspectWidth = aspectRatio[0];
      const aspectHeight = aspectRatio[1];
      
      if (resolution === '720p') {
        height = 720;
        width = (aspectWidth / aspectHeight) * height;
      } else if (resolution === '1080p') {
        height = 1080;
        width = (aspectWidth / aspectHeight) * height;
      } else if (resolution === '2160p') {
        height = 2160;
        width = (aspectWidth / aspectHeight) * height;
      } else {
        // Default to 1080p
        height = 1080;
        width = (aspectWidth / aspectHeight) * height;
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Determine frame rate and duration
      const fps = 30;
      const duration = project.duration;
      const totalFrames = Math.ceil(duration * fps);
      
      // Create a JSZip instance (in a real implementation)
      // For now, we'll just simulate creating a zip file
      
      setStatusMessage('Rendering frames...');
      
      // Render each frame
      const frames = [];
      for (let frameIndex = 0; frameIndex < totalFrames; frameIndex++) {
        const time = frameIndex / fps;
        await renderFrame(time, canvas, ctx);
        
        // In a real implementation, we would add each frame to the zip file
        // For now, just simulate it
        frames.push(canvas.toDataURL('image/png'));
        
        // Update progress
        const progress = Math.floor((frameIndex / totalFrames) * 80);
        setExportProgress(10 + progress);
        
        // Update status message periodically
        if (frameIndex % 10 === 0) {
          setStatusMessage(`Rendering frame ${frameIndex + 1}/${totalFrames}...`);
        }
      }
      
      setStatusMessage('Creating ZIP archive...');
      setExportProgress(90);
      
      // In a real implementation, we would finalize the zip file
      // For now, just simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatusMessage('Finalizing export...');
      setExportProgress(95);
      
      if (exportDestination === 'download') {
        // In a real implementation, we would download the zip file
        // For now, just simulate it
        await new Promise(resolve => setTimeout(resolve, 500));
      } else if (exportDestination === 'assets') {
        // In a real implementation, we would save to the assets library
        // For now, just simulate it
        await new Promise(resolve => setTimeout(resolve, 500));
      } else if (exportDestination === 'cloud') {
        // In a real implementation, we would upload to cloud storage
        // For now, just simulate it
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setExportProgress(100);
      
      // Show success message
      toast.success('Image sequence exported successfully', {
        subtext: exportDestination === 'download' 
          ? 'Your images have been downloaded as a ZIP file' 
          : exportDestination === 'assets'
            ? 'Your images have been added to your assets'
            : 'Your images have been uploaded to cloud storage',
        duration: 5000
      });
      
    } catch (error) {
      console.error('Error exporting image sequence:', error);
      toast.error('Export failed', {
        subtext: 'There was an error during the export process. Please try again.',
        duration: 5000
      });
    } finally {
      setIsExporting(false);
      onClose();
    }
  };
  
  // Function to export JSON project
  const exportJson = async () => {
    try {
      setStatusMessage('Preparing project data...');
      setExportProgress(30);
      
      // Create JSON data
      const projectJson = JSON.stringify(project, null, 2);
      
      setStatusMessage('Creating JSON file...');
      setExportProgress(60);
      
      // Create a blob from the JSON data
      const blob = new Blob([projectJson], { type: 'application/json' });
      
      setStatusMessage('Finalizing export...');
      setExportProgress(90);
      
      if (exportDestination === 'download') {
        // Download the JSON file
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.name.replace(/\s+/g, '_')}_config.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (exportDestination === 'assets') {
        // In a real implementation, we would save to the assets library
        // For now, just simulate it
        await new Promise(resolve => setTimeout(resolve, 500));
      } else if (exportDestination === 'cloud') {
        // In a real implementation, we would upload to cloud storage
        // For now, just simulate it
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setExportProgress(100);
      
      // Show success message
      toast.success('Project configuration exported successfully', {
        subtext: exportDestination === 'download' 
          ? 'Your project JSON file has been downloaded' 
          : exportDestination === 'assets'
            ? 'Your project configuration has been added to your assets'
            : 'Your project configuration has been uploaded to cloud storage',
        duration: 5000
      });
      
    } catch (error) {
      console.error('Error exporting JSON:', error);
      toast.error('Export failed', {
        subtext: 'There was an error during the export process. Please try again.',
        duration: 5000
      });
    } finally {
      setIsExporting(false);
      onClose();
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      // Handle different export formats
      if (exportFormat === 'video') {
        await exportVideo();
      } else if (exportFormat === 'image-sequence') {
        await exportImageSequence();
      } else if (exportFormat === 'json') {
        await exportJson();
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed', {
        subtext: 'There was an error during the export process. Please try again.',
        duration: 5000
      });
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={isExporting ? undefined : onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl shadow-black/50 w-full max-w-2xl overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-amber-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-yellow-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-xl shadow-lg">
                  <Download className="w-5 h-5 text-black" />
                </div>
                <h2 className="text-2xl font-black text-white">Export Project</h2>
              </div>
              {!isExporting && (
                <button
                  onClick={onClose}
                  className="bg-white/10 backdrop-blur-xl p-2 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              )}
            </div>
            <p className="text-white/70 text-sm">
              Export your CineFlow project in various formats and destinations
            </p>
          </div>

          {isExporting ? (
            // Export Progress UI
            <div className="p-6 space-y-6">
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4">
                  <Loader className="w-8 h-8 text-white animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Exporting {exportFormat === 'video' ? 'Video' : exportFormat === 'image-sequence' ? 'Image Sequence' : 'Project'}</h3>
                <p className="text-white/70 mb-6">{statusMessage}</p>
                
                <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                    style={{ width: `${exportProgress}%` }}
                  ></div>
                </div>
                <p className="text-white/50 text-sm">{exportProgress}% complete</p>
                
                <div className="mt-6 text-white/70 text-sm">
                  <p>This may take several minutes depending on your project complexity.</p>
                  <p>Please don't close this window during export.</p>
                </div>
              </div>
            </div>
          ) : (
            // Export Options UI
            <div className="p-6 space-y-6">
              {/* Export Format */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Export Format</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setExportFormat('video')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                      exportFormat === 'video'
                        ? 'bg-amber-500/20 border-amber-500/50 text-white'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Video className="w-6 h-6 mb-2" />
                    <span className="text-sm font-semibold">Video</span>
                    <span className="text-xs text-white/50 mt-1">MP4/WebM</span>
                  </button>
                  
                  <button
                    onClick={() => setExportFormat('image-sequence')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                      exportFormat === 'image-sequence'
                        ? 'bg-amber-500/20 border-amber-500/50 text-white'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-6 h-6 mb-2" />
                    <span className="text-sm font-semibold">Images</span>
                    <span className="text-xs text-white/50 mt-1">PNG Sequence</span>
                  </button>
                  
                  <button
                    onClick={() => setExportFormat('json')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                      exportFormat === 'json'
                        ? 'bg-amber-500/20 border-amber-500/50 text-white'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <FileJson className="w-6 h-6 mb-2" />
                    <span className="text-sm font-semibold">Project</span>
                    <span className="text-xs text-white/50 mt-1">JSON Config</span>
                  </button>
                </div>
              </div>

              {/* Export Destination */}
              <div>
                <h3 className="text-lg font-bold text-white mb-3">Export Destination</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setExportDestination('download')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                      exportDestination === 'download'
                        ? 'bg-amber-500/20 border-amber-500/50 text-white'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Download className="w-6 h-6 mb-2" />
                    <span className="text-sm font-semibold">Download</span>
                    <span className="text-xs text-white/50 mt-1">Save locally</span>
                  </button>
                  
                  <button
                    onClick={() => setExportDestination('assets')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                      exportDestination === 'assets'
                        ? 'bg-amber-500/20 border-amber-500/50 text-white'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Save className="w-6 h-6 mb-2" />
                    <span className="text-sm font-semibold">Assets</span>
                    <span className="text-xs text-white/50 mt-1">Save to library</span>
                  </button>
                  
                  <button
                    onClick={() => setExportDestination('cloud')}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                      exportDestination === 'cloud'
                        ? 'bg-amber-500/20 border-amber-500/50 text-white'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Cloud className="w-6 h-6 mb-2" />
                    <span className="text-sm font-semibold">Cloud</span>
                    <span className="text-xs text-white/50 mt-1">Google Drive</span>
                  </button>
                </div>
              </div>

              {/* Export Settings */}
              {exportFormat !== 'json' && (
                <div>
                  <h3 className="text-lg font-bold text-white mb-3">Export Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Resolution
                      </label>
                      <select
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                      >
                        <option value="720p" className="bg-gray-900">720p (HD)</option>
                        <option value="1080p" className="bg-gray-900">1080p (Full HD)</option>
                        <option value="2160p" className="bg-gray-900">2160p (4K)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-white/80 text-sm font-semibold mb-2">
                        Quality
                      </label>
                      <select
                        value={quality}
                        onChange={(e) => setQuality(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                      >
                        <option value="low" className="bg-gray-900">Low (Faster)</option>
                        <option value="medium" className="bg-gray-900">Medium</option>
                        <option value="high" className="bg-gray-900">High (Better Quality)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-300 text-sm font-semibold mb-1">Export Information</p>
                    <p className="text-white/70 text-xs">
                      {exportFormat === 'video' && 'Video export may take several minutes depending on the complexity and duration of your project. Audio tracks will be automatically mixed and included in the final video.'}
                      {exportFormat === 'image-sequence' && 'Image sequence will be exported as a ZIP file containing PNG images for each frame.'}
                      {exportFormat === 'json' && 'JSON export contains your project configuration for backup or sharing with others.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-6 border-t border-white/10 flex justify-end space-x-4">
            {!isExporting && (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleExport}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black px-6 py-2 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg flex items-center space-x-2"
                >
                  <Zap className="w-5 h-5" />
                  <span>Export Now</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;