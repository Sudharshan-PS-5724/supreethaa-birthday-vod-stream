import { FilterOption, VisualFilter } from '@/types/video';

export const VISUAL_FILTERS: FilterOption[] = [
  {
    id: 'normal',
    name: 'Original',
    description: 'Natural high-definition camera colors',
    cssClass: '',
    filterStyle: 'none',
  },
  {
    id: 'cinematic',
    name: 'Cinematic Warm',
    description: 'Warm movie lighting with rich shadows',
    cssClass: 'filter-cinematic',
    filterStyle: 'contrast(1.15) saturate(1.25) sepia(0.15) brightness(1.02)',
  },
  {
    id: 'sepia',
    name: 'Vintage Dream',
    description: 'Warm nostalgic sepia tone memories',
    cssClass: 'filter-sepia',
    filterStyle: 'sepia(0.6) contrast(1.1) brightness(0.95) hue-rotate(-10deg)',
  },
  {
    id: 'vintage',
    name: 'Retro 90s',
    description: 'Analog VHS vibe with soft pastel tint',
    cssClass: 'filter-vintage',
    filterStyle: 'sepia(0.3) saturate(1.4) hue-rotate(330deg) contrast(0.95)',
  },
  {
    id: 'noir',
    name: 'Classic B&W',
    description: 'Dramatic black & white monochrome',
    cssClass: 'filter-noir',
    filterStyle: 'grayscale(1) contrast(1.3) brightness(0.95)',
  },
  {
    id: 'neon',
    name: 'Cyber Neon',
    description: 'Cool purple & cyan party glow',
    cssClass: 'filter-neon',
    filterStyle: 'hue-rotate(200deg) saturate(1.8) contrast(1.2)',
  },
  {
    id: 'warm',
    name: 'Warm Party Glow',
    description: 'Soft candlelight warmth & cozy tones',
    cssClass: 'filter-warm',
    filterStyle: 'sepia(0.25) saturate(1.3) brightness(1.05) hue-rotate(-5deg)',
  },
  {
    id: 'contrast',
    name: 'Vibrant Celebration',
    description: 'Punchy vivid colors & deep contrast',
    cssClass: 'filter-contrast',
    filterStyle: 'saturate(1.6) contrast(1.25) brightness(1.05)',
  },
  {
    id: 'glow',
    name: 'Soft Focus Glow',
    description: 'Ethereal dreamy bloom effect',
    cssClass: 'filter-glow',
    filterStyle: 'brightness(1.1) contrast(1.05) drop-shadow(0 0 12px rgba(236,72,153,0.3))',
  },
];

export function getFilterById(id: VisualFilter): FilterOption {
  return VISUAL_FILTERS.find((f) => f.id === id) || VISUAL_FILTERS[0];
}
