// Beat and Cart System Types

export interface Beat {
  beat_id: string;
  title: string;
  bpm: number;
  key: string;
  genres: string[];
  preview_path: string;
  full_path: string;
  cover_path: string;
  lease_price: number;
  exclusive_price: number;
  created_at?: string;
  tags?: string[];
  mood?: string[];
  plays?: number;
  googleDriveFileId?: string;
  googleDriveCoverId?: string;
}

export interface BeatsData {
  beats: Beat[];
}

export type LicenseType = 'lease' | 'exclusive';

export interface BeatCartItem {
  type: 'beat';
  beat_id: string;
  beat_title: string;
  license_type: LicenseType;
  price: number;
  cover_path: string;
}

import type { ServiceCartItem } from './services';

export type CartItem = BeatCartItem | ServiceCartItem;

export interface CartState {
  items: CartItem[];
  total: number;
  isOpen: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface BeatFilters {
  genre?: string;
  mood?: string;
  bpmMin?: number;
  bpmMax?: number;
  key?: string;
  search?: string;
}

// Available filter options
export const GENRES = [
  'Trap',
  'Hip Hop',
  'R&B',
  'Pop',
  'Drill',
  'Afrobeats',
  'Gospel',
  'Jazz',
  'Soul',
  'Electronic',
  'Other'
];

export const MOODS = [
  'Dark',
  'Chill',
  'Energetic',
  'Smooth',
  'Hard',
  'Melodic',
  'Aggressive',
  'Emotional'
];

export const KEYS = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
  'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm'
];

export const BPM_RANGES = {
  min: 60,
  max: 200,
  step: 5
};
