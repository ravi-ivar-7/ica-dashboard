// export/utils/canvasUtils.ts
import { CanvasElementType } from '@/CineFlowModule/Types/Cineflow';

export const renderFrame = async (
  time: number,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  elements: CanvasElementType[]
) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Get visible elements at this time
  const visibleElements = elements.filter(element => 
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
        await drawImageElement(element, ctx);
      }
      break;
    case 'video':
      if (element.src) {
        await drawVideoElement(element, time, ctx);
      }
      break;
    case 'text':
      if (element.text) {
        drawTextElement(element, ctx);
      }
      break;
    case 'element':
      if (element.src) {
        await drawImageElement(element, ctx);
      }
      break;
  }
  
  ctx.restore();
  ctx.globalAlpha = 1;
};

const drawImageElement = async (element: CanvasElementType, ctx: CanvasRenderingContext2D) => {
  
  const img = new window.Image();
  // Set crossOrigin before setting src to prevent canvas taint
  img.crossOrigin = 'anonymous';
  img.src = element.src!;
  await new Promise((resolve) => {
    img.onload = resolve;
    img.onerror = resolve;// Continue even if image fails to load
  });
  try {
    ctx.drawImage(img, element.x, element.y, element.width, element.height);
  } catch (error) {
    console.warn('Failed to draw image:', error);
  }
};

const drawVideoElement = async (element: CanvasElementType, time: number, ctx: CanvasRenderingContext2D) => {
  if (!element.src) {
    console.warn('Video element src is undefined');
    return;
  }
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
    console.warn('Failed to draw video frame:', error);
  }
};

const drawTextElement = (element: CanvasElementType, ctx: CanvasRenderingContext2D) => {
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
  
  const words = (element.text ?? '').split(' ');
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
};