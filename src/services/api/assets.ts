import type { Asset } from '@/types/cineflow';

const fallbackAssets: Asset[] = [
  // 🎵 Audio
  {
    id: 'aud1',
    type: 'audio',
    name: 'Upbeat Music.mp3',
    src: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
    duration: '00:01:30'
  },
  {
    id: 'aud2',
    type: 'audio',
    name: 'Ambient Sounds.mp3',
    src: 'https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3',
    duration: '00:02:15'
  },
  {
    id: 'aud3',
    type: 'audio',
    name: 'Cinematic Score.mp3',
    src: 'https://assets.mixkit.co/music/preview/mixkit-epical-drums-01-676.mp3',
    duration: '00:01:45'
  },

  // 🖼️ Images
  {
    id: 'img1',
    type: 'image',
    name: 'Nature View.jpg',
    src: 'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  },
  {
    id: 'img2',
    type: 'image',
    name: 'Workspace Setup.png',
    src: 'https://images.pexels.com/photos/705675/pexels-photo-705675.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  },
  {
    id: 'img3',
    type: 'image',
    name: 'City Nightlife.png',
    src: 'https://images.pexels.com/photos/358485/pexels-photo-358485.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
  },

  // 🎥 Videos
  {
    id: 'vid1',
    type: 'video',
    name: 'Drone Footage.mp4',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-aerial-shot-of-a-city-at-night-1416-large.mp4',
    duration: '00:00:25'
  },
  {
    id: 'vid2',
    type: 'video',
    name: 'Nature Timelapse.mp4',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-timelapse-of-a-cloudy-sky-1685-large.mp4',
    duration: '00:00:40'
  },
  {
    id: 'vid3',
    type: 'video',
    name: 'Office B-roll.mp4',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-working-in-modern-office-3374-large.mp4',
    duration: '00:00:20'
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
