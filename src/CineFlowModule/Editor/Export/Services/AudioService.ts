// export/services/audioService.ts
import { CanvasElementType } from '@/CineFlowModule/Types/Cineflow';


export const processAudio = async (elements: CanvasElementType[], duration: number) => {
  if (!window.AudioContext) {
    console.warn('AudioContext not available');
    return null;
  }
  
  const audioElements = elements.filter(el => el.type === 'audio');
  if (audioElements.length === 0) return null;
  
  try {
    const offlineCtx = new OfflineAudioContext(
      2,
      44100 * duration,
      44100
    );
    
    const audioBuffers = await Promise.all(
      audioElements.map(async (element) => {
        try {
          if (!element.src) {
            throw new Error('Audio element src is undefined');
          }
          const response = await fetch(element.src);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await offlineCtx.decodeAudioData(arrayBuffer);
          const source = offlineCtx.createBufferSource();
          source.buffer = audioBuffer;
          const gainNode = offlineCtx.createGain();
          gainNode.gain.value = element.opacity !== undefined ? element.opacity : 1;
          source.connect(gainNode);
          gainNode.connect(offlineCtx.destination);
          source.start(element.startTime);
          return { source, element };
        } catch (error) {
          console.error('Error processing audio element:', error);
          return null;
        }
      })
    );
    
    const validAudioBuffers = audioBuffers.filter(buffer => buffer !== null);
    if (validAudioBuffers.length === 0) return null;
    
    const renderedBuffer = await offlineCtx.startRendering();
    return audioBufferToWav(renderedBuffer);
  } catch (error) {
    console.error('Error processing audio:', error);
    return null;
  }
};

const audioBufferToWav = (buffer: AudioBuffer): Promise<Blob> => {
  return new Promise((resolve) => {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1;
    const bitDepth = 16;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const headerSize = 44;
    const dataSize = buffer.length * numChannels * bytesPerSample;
    const wavSize = headerSize + dataSize;
    const wavBuffer = new ArrayBuffer(wavSize);
    const view = new DataView(wavBuffer);
    
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataSize, true);
    
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
    
    resolve(new Blob([wavBuffer], { type: 'audio/wav' }));
  });
};

const writeString = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};