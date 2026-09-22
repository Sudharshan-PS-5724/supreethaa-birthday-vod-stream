import { VideoItem } from '@/types/video';

export const BIRTHDAY_VIDEOS: VideoItem[] = [
  {
    id: 'entry-cake-cutting',
    title: 'Grand Entry & Cake Cutting Introduction',
    subtitle: 'Opening Ceremony & Celebration Highlights',
    description: 'The heartwarming arrival of Supreethaa, warm birthday welcomes, photo moments, and the official birthday cake cutting ceremony with friends & family.',
    duration: '5:14',
    durationSeconds: 314,
    size: '346 MB',
    resolution: '1920 x 1080 (1080p Full HD)',
    aspectRatio: '16:9',
    filename: 'Entry and Cake Cutting Introduction.MOV',
    tags: ['Cake Cutting', 'Grand Entry', 'Celebration', 'High Energy'],
    date: 'Birthday Celebration 2026',
    eventSection: 'Part 1 - Opening',
  },
  {
    id: 'sudharshan-game-intro',
    title: 'Sudharshan - Sup Game Introduction',
    subtitle: 'Host Welcome & Party Rules',
    description: 'Sudharshan takes the mic to kick off the custom interactive party games, introducing rules, team reveals, and setting up the night of fun.',
    duration: '1:42',
    durationSeconds: 102,
    size: '114 MB',
    resolution: '1920 x 1080 (1080p Full HD)',
    aspectRatio: '16:9',
    filename: 'Sudharshan - Sup Game Introduction.MOV',
    tags: ['Game Intro', 'Host Speech', 'Sudharshan', 'Party Fun'],
    date: 'Birthday Celebration 2026',
    eventSection: 'Part 2 - Game Intro',
  },
  {
    id: 'supreethaa-birthday-game',
    title: "Supreethaa's Birthday Game - Main Event",
    subtitle: 'Complete Interactive Birthday Games & Unfiltered Fun',
    description: 'The full 1 hour 44 minute main feature recording of Supreethaa’s epic birthday game session. Packed with laughs, roast sessions, challenges, and memorable trivia.',
    duration: '1h 43m 53s',
    durationSeconds: 6233,
    size: '5.99 GB',
    resolution: '1920 x 1080 (1080p Full HD)',
    aspectRatio: '16:9',
    filename: "Supreethaa's Birthday Game.MOV",
    tags: ['Main Feature', 'Party Games', 'Full Recording', 'Unfiltered Laughs'],
    date: 'Birthday Celebration 2026',
    eventSection: 'Part 3 - Main Feature',
  },
];

export function getVideoById(id: string): VideoItem | undefined {
  return BIRTHDAY_VIDEOS.find((v) => v.id === id);
}

export function getVideoStreamUrl(video: VideoItem): string {
  const r2Base = process.env.NEXT_PUBLIC_R2_BASE_URL?.trim();
  if (r2Base && r2Base.length > 0 && !r2Base.includes('demo-r2-url')) {
    // Clean up trailing slash
    const base = r2Base.replace(/\/$/, '');
    const cleanFilename = encodeURIComponent(video.filename);
    return `${base}/${cleanFilename}`;
  }
  // Local fallback endpoint for development & testing
  return `/api/video?file=${encodeURIComponent(video.filename)}`;
}

export function downloadVideoFile(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
