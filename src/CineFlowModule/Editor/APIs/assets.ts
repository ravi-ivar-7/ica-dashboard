import type { Asset } from '@/CineFlowModule/Types/Cineflow';

const fallbackAssets: Asset[] = [
  // 🎵 Audio
  {
    id: 'aud1',
    type: 'audio',
    name: 'Sample Audio 1',
    src: '/sample-media/SampleAudio_1.mp3',
    duration: '00:00:10'
  },
  {
    id: 'aud2',
    type: 'audio',
    name: 'Sample Audio 2',
    src: '/sample-media/SampleAudio_2.mp3',
    duration: '00:00:15'
  },
  {
    id: 'aud3',
    type: 'audio',
    name: 'Sample Audio 3',
    src: '/sample-media/SampleAudio_3.mp3',
    duration: '00:00:20'
  },

  // 🖼️ Images
  {
    id: 'img1',
    type: 'image',
    name: 'Sample Image 1',
    src: '/sample-media/SampleImage_1.png'
  },
  {
    id: 'img2',
    type: 'image',
    name: 'Sample Image 2',
    src: '/sample-media/SampleImage_2.png'
  },
  {
    id: 'img3',
    type: 'image',
    name: 'Sample Image 3',
    src: '/sample-media/SampleImage_3.png'
  },

  // 🎥 Videos
  {
    id: 'vid1',
    type: 'video',
    name: 'Sample Video 1',
    src: '/sample-media/SampleVideo_Rabbit.mp4',
    poster: '/sample-media/SampleImage_1.png',
    duration: '00:00:06'
  },
  {
    id: 'vid2',
    type: 'video',
    name: 'Sample Video 2',
    src: '/sample-media/SampleVideo_Earth.mp4',
    poster: '/sample-media/SampleImage_2.png',
    duration: '00:00:15'
  },
  {
    id: 'vid3',
    type: 'video',
    name: 'Sample Video 3',
    src: '/sample-media/SampleVideo_BrowserCity.mp4',
    poster: '/sample-media/SampleImage_3.png',
    duration: '00:00:25'
  }
];

export const getAssets = async (): Promise<Asset[]> => {
  try {
    const res = await fetch('/api/assets');
    if (!res.ok) throw new Error('Network response was not ok');

    const data = await res.json();

    // If empty or invalid, return fallback
    if (!Array.isArray(data) || data.length === 0) {
      console.warn('[Assets API] No assets returned, using fallback.');
      return fallbackAssets;
    }

    return data;
  } catch (err) {
    console.error('[Assets API] Error fetching assets:', err);
    return fallbackAssets;
  }
};
