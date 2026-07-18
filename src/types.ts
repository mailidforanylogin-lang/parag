export type TemplateType =
  | 'royal-gold'
  | 'floral'
  | 'traditional-indian'
  | 'modern-luxury'
  | 'dark-elegant'
  | 'minimal-white'
  | 'marathi-theme';

export interface FontConfig {
  headerFont: string;    // 'font-display' | 'font-serif' | 'font-sans' | 'font-marathi'
  bodyFont: string;      // 'font-sans' | 'font-serif' | 'font-mono'
  accentFont: string;    // 'font-script' | 'font-serif'
}

export interface InvitationData {
  groomName: string;
  brideName: string;
  engagementDate: string; // YYYY-MM-DD
  engagementTime: string;
  venueName: string;
  venueAddress: string;
  googleMapLink: string;
  familyDetailsGroom: string;
  familyDetailsBride: string;
  contactNumber: string;
  dressCode: string;
  rsvpDetails: string;
  customMessage: string;
  language: 'en' | 'mr'; // English | Marathi
  bgMusicId: string; // 'shehnai' | 'flute' | 'piano' | 'acoustic'
  templateId: TemplateType;
  primaryColor: string;
  secondaryColor: string;
  couplePhotoUrl: string;
  backgroundPhotoUrl: string;
  familyPhotoUrl: string;
  ringPhotoUrl: string;
  rsvpFormActive: boolean;
  weddingWebsiteActive: boolean;
  weddingWebsiteUrl: string;
  photoCropScale?: number;
  photoCropX?: number;
  photoCropY?: number;
  photoCropRotate?: number;
  photoFrameShape?: 'rect' | 'circle' | 'heart' | 'arch';
  textAlignment?: 'left' | 'center' | 'right';
  photoFrameSize?: 'small' | 'medium' | 'large';
}

export interface MusicTrack {
  id: string;
  name: string;
  url: string;
  category: string;
}

export interface TemplatePreset {
  id: TemplateType;
  name: string;
  nameMarathi: string;
  primaryColor: string;
  secondaryColor: string;
  fontConfig: FontConfig;
  backgroundUrl: string;
  ringUrl: string;
  description: string;
}

export interface SavedDraft {
  id: string;
  title: string;
  updatedAt: string;
  data: InvitationData;
}
