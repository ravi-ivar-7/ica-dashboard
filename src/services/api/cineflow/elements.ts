import type { Element } from '@/types/cineflow';

const fallbackElements: Element[] = [
  { id: 'element1', name: 'Star', src: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png', type: 'element' },
  { id: 'element2', name: 'Heart', src: 'https://cdn-icons-png.flaticon.com/512/833/833472.png', type: 'element' },
  { id: 'element3', name: 'Arrow', src: 'https://cdn-icons-png.flaticon.com/512/2989/2989981.png', type: 'element' },
  { id: 'element4', name: 'Circle', src: 'https://cdn-icons-png.flaticon.com/512/481/481662.png', type: 'element' },
  { id: 'element5', name: 'Square', src: 'https://cdn-icons-png.flaticon.com/512/33/33714.png', type: 'element' },
  { id: 'element6', name: 'Triangle', src: 'https://cdn-icons-png.flaticon.com/512/649/649738.png', type: 'element' }
];

export const getElements = async (): Promise<Element[]> => {
  try {
    const res = await fetch('/api/elements');
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return fallbackElements;
    return data;
  } catch (err) {
    console.error('[Elements API] Fallback to mock data:', err);
    return fallbackElements;
  }
};
