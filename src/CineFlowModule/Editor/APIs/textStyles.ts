import type { TextStyle } from '@/CineFlowModule/Types/Cineflow';

const fallbackTextStyles: TextStyle[] = [
  {
    id: 'text1',
    name: 'Heading',
    style: { fontFamily: 'sans-serif', fontSize: 48, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' }
  },
  {
    id: 'text2',
    name: 'Subheading',
    style: { fontFamily: 'sans-serif', fontSize: 32, fontWeight: 'bold', color: '#ffffff', textAlign: 'center' }
  },
  {
    id: 'text3',
    name: 'Body Text',
    style: { fontFamily: 'sans-serif', fontSize: 24, color: '#ffffff', textAlign: 'left' }
  },
  {
    id: 'text4',
    name: 'Caption',
    style: { fontFamily: 'sans-serif', fontSize: 16, color: '#ffffff', textAlign: 'center' }
  },
  {
    id: 'text5',
    name: 'Title - Fancy',
    style: { fontFamily: 'cursive', fontSize: 64, fontWeight: 'bold', color: '#ffcc00', textAlign: 'center' }
  }
];

export const getTextStyles = async (): Promise<TextStyle[]> => {
  try {
    const res = await fetch('/api/textStyles');
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return fallbackTextStyles;
    return data;
  } catch (err) {
    console.error('[TextStyles API] Fallback to mock data:', err);
    return fallbackTextStyles;
  }
};
