import { Asset, Template, Element, TextStyle } from '../types/cineflow';

// Mock assets
export const mockAssets: Asset[] = [
  {
    id: 'img1',
    type: 'image',
    name: 'Beach Sunset.jpg',
    src: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'img2',
    type: 'image',
    name: 'Mountain View.jpg',
    src: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'img3',
    type: 'image',
    name: 'City Skyline.jpg',
    src: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 'vid1',
    type: 'video',
    name: 'Ocean Waves.mp4',
    src: 'https://player.vimeo.com/external/368763065.sd.mp4?s=13ac3e0c0c9eee93c3b28d67e0a748256cf3d076&profile_id=139&oauth2_token_id=57447761',
    duration: '00:00:15'
  },
  {
    id: 'vid2',
    type: 'video',
    name: 'Forest Walk.mp4',
    src: 'https://player.vimeo.com/external/403295710.sd.mp4?s=788b046826f92983ada6e5caf067113fdb49e209&profile_id=139&oauth2_token_id=57447761',
    duration: '00:00:20'
  },
  {
    id: 'aud1',
    type: 'audio',
    name: 'Upbeat Music.mp3',
    src: 'https://example.com/audio1.mp3',
    duration: '00:01:30'
  },
  {
    id: 'aud2',
    type: 'audio',
    name: 'Ambient Sounds.mp3',
    src: 'https://example.com/audio2.mp3',
    duration: '00:02:15'
  }
];

// Mock templates
export const mockTemplates: Template[] = [
  {
    id: 'template1',
    name: 'Product Showcase',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
    aspectRatio: '16:9',
    duration: 30,
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
    ],
    tags: ['product', 'business', 'showcase']
  },
  {
    id: 'template2',
    name: 'Travel Montage',
    thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
    aspectRatio: '16:9',
    duration: 45,
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
    ],
    tags: ['travel', 'montage', 'adventure']
  },
  {
    id: 'template3',
    name: 'Social Media Story',
    thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600',
    aspectRatio: '9:16',
    duration: 15,
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
    ],
    tags: ['social', 'story', 'vertical']
  },
  {
    id: 'template4',
    name: 'Corporate Intro',
    thumbnail: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600',
    aspectRatio: '16:9',
    duration: 20,
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
    ],
    tags: ['corporate', 'business', 'intro']
  }
];

// Mock elements (stickers, shapes, etc.)
export const mockElements: Element[] = [
  {
    id: 'element1',
    name: 'Star',
    src: 'https://cdn-icons-png.flaticon.com/512/1828/1828884.png',
    type: 'element'
  },
  {
    id: 'element2',
    name: 'Heart',
    src: 'https://cdn-icons-png.flaticon.com/512/833/833472.png',
    type: 'element'
  },
  {
    id: 'element3',
    name: 'Arrow',
    src: 'https://cdn-icons-png.flaticon.com/512/2989/2989981.png',
    type: 'element'
  },
  {
    id: 'element4',
    name: 'Circle',
    src: 'https://cdn-icons-png.flaticon.com/512/481/481662.png',
    type: 'element'
  },
  {
    id: 'element5',
    name: 'Square',
    src: 'https://cdn-icons-png.flaticon.com/512/33/33714.png',
    type: 'element'
  },
  {
    id: 'element6',
    name: 'Triangle',
    src: 'https://cdn-icons-png.flaticon.com/512/649/649738.png',
    type: 'element'
  }
];

// Mock text styles
export const mockTextStyles: TextStyle[] = [
  {
    id: 'text1',
    name: 'Heading',
    style: {
      fontFamily: 'sans-serif',
      fontSize: 48,
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center'
    }
  },
  {
    id: 'text2',
    name: 'Subheading',
    style: {
      fontFamily: 'sans-serif',
      fontSize: 32,
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center'
    }
  },
  {
    id: 'text3',
    name: 'Body Text',
    style: {
      fontFamily: 'sans-serif',
      fontSize: 24,
      color: '#ffffff',
      textAlign: 'left'
    }
  },
  {
    id: 'text4',
    name: 'Caption',
    style: {
      fontFamily: 'sans-serif',
      fontSize: 16,
      color: '#ffffff',
      textAlign: 'center'
    }
  },
  {
    id: 'text5',
    name: 'Title - Fancy',
    style: {
      fontFamily: 'cursive',
      fontSize: 64,
      fontWeight: 'bold',
      color: '#ffcc00',
      textAlign: 'center'
    }
  }
];