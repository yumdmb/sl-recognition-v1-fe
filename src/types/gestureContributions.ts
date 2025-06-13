// Types for Gesture Contributions module
export interface GestureContribution {
  id: string;
  title: string;
  description: string;
  language: 'ASL' | 'MSL';
  media_type: 'image' | 'video';
  media_url: string;
  thumbnail_url?: string;
  submitted_by: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  // Populated from joins
  submitter?: {
    id: string;
    name: string;
    email: string;
  };
  reviewer?: {
    id: string;
    name: string;
  };
}

export interface GestureContributionFilters {
  status?: 'pending' | 'approved' | 'rejected' | 'all';
  language?: 'ASL' | 'MSL' | 'all';
  search?: string;
  submitted_by?: string; // For filtering by user
}

export interface GestureContributionFormData {
  title: string;
  description: string;
  language: 'ASL' | 'MSL';
  media_type: 'image' | 'video';
  file?: File;
}
