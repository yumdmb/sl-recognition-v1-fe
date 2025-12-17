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
  // Category support (unified with gesture dictionary)
  category_id?: number | null;
  source?: 'admin' | 'contribution';
  // Duplicate detection fields
  is_duplicate?: boolean;
  duplicate_of?: string;
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
  category?: {
    id: number;
    name: string;
    icon?: string;
  };
}

export interface GestureCategory {
  id: number;
  name: string;
  icon?: string | null;
  count?: number;
}

export interface GestureContributionFilters {
  status?: 'pending' | 'approved' | 'rejected' | 'all';
  language?: 'ASL' | 'MSL' | 'all';
  search?: string;
  submitted_by?: string; // For filtering by user
  category_id?: number | null; // Filter by category
}

export interface GestureContributionFormData {
  title: string;
  description: string;
  language: 'ASL' | 'MSL';
  media_type: 'image' | 'video';
  category_id?: number | null;
  file?: File;
}
