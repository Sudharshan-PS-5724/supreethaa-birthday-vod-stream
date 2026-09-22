export interface VideoItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  durationSeconds: number;
  size: string;
  resolution: string;
  aspectRatio: string;
  filename: string;
  localPath?: string;
  tags: string[];
  thumbnailUrl?: string;
  date: string;
  eventSection: string;
}

export type VisualFilter =
  | 'normal'
  | 'cinematic'
  | 'vintage'
  | 'sepia'
  | 'noir'
  | 'neon'
  | 'warm'
  | 'contrast'
  | 'glow';

export type AspectRatioFit = 'contain' | 'cover' | 'fill' | 'original';

export interface FilterOption {
  id: VisualFilter;
  name: string;
  description: string;
  cssClass: string;
  filterStyle: string;
  icon?: string;
}
