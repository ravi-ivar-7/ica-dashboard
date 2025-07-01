import type { Template } from '@/types/cineflow';

const fallbackTemplates: Template[] = [
  {
    id: 'template1',
    name: 'Product Showcase',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
    aspectRatio: '16:9',
    duration: 30,
    tags: ['product', 'business', 'showcase'],
    elements: [
      {
        id: 'template1-el1',
        type: 'text',
        text: 'YOUR PRODUCT NAME',
        x: 100,
        y: 100,
        width: 400,
        height: 100,
        startTime: 0,
        duration: 5,
        fontFamily: 'sans-serif',
        fontSize: 48,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center'
      },
      {
        id: 'template1-el2',
        type: 'text',
        text: 'Tagline or description goes here',
        x: 100,
        y: 200,
        width: 400,
        height: 50,
        startTime: 1,
        duration: 5,
        fontFamily: 'sans-serif',
        fontSize: 24,
        color: '#ffffff',
        textAlign: 'center'
      }
    ]
  },
  {
    id: 'template2',
    name: 'Travel Montage',
    thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
    aspectRatio: '16:9',
    duration: 45,
    tags: ['travel', 'montage', 'adventure'],
    elements: [
      {
        id: 'template2-el1',
        type: 'text',
        text: 'ADVENTURE AWAITS',
        x: 100,
        y: 100,
        width: 400,
        height: 100,
        startTime: 0,
        duration: 5,
        fontFamily: 'serif',
        fontSize: 48,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center'
      }
    ]
  },
  {
    id: 'template3',
    name: 'Social Media Story',
    thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600',
    aspectRatio: '9:16',
    duration: 15,
    tags: ['social', 'story', 'vertical'],
    elements: [
      {
        id: 'template3-el1',
        type: 'text',
        text: 'SWIPE UP',
        x: 100,
        y: 500,
        width: 200,
        height: 50,
        startTime: 10,
        duration: 5,
        fontFamily: 'sans-serif',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center'
      }
    ]
  },
  {
    id: 'template4',
    name: 'Corporate Intro',
    thumbnail: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
    aspectRatio: '16:9',
    duration: 20,
    tags: ['corporate', 'business', 'intro'],
    elements: [
      {
        id: 'template4-el1',
        type: 'text',
        text: 'COMPANY NAME',
        x: 100,
        y: 100,
        width: 400,
        height: 100,
        startTime: 0,
        duration: 5,
        fontFamily: 'sans-serif',
        fontSize: 48,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center'
      }
    ]
  }
];

export const getTemplates = async (): Promise<Template[]> => {
  try {
    const res = await fetch('/api/templates');
    if (!res.ok) throw new Error('Network response was not ok');
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return fallbackTemplates;
    return data;
  } catch (err) {
    console.error('[Templates API] Fallback to mock data:', err);
    return fallbackTemplates;
  }
};
