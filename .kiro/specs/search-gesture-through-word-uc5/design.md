# Design Document: Search Gesture Through Word

## Overview

The Search Gesture Through Word system provides comprehensive gesture discovery through text search and filtering. Built with Next.js 15 and Supabase, the system enables users to search approved community-contributed gestures by word, filter by language, and browse through a responsive grid layout. The feature integrates with the gesture contribution system (UC6) and uses the existing `useGestureContributions` hook for data management.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Next.js)                   │
├─────────────────────────────────────────────────────────────┤
│  Browse Page  │  Filters  │  Grid Display  │  Detail Modal  │
└────────────┬────────────────────┬─────────────────┬─────────┘
             │                    │                 │
             ▼                    ▼                 ▼
┌─────────────────────────────────────────────────────────────┐
│                   Custom Hooks Layer                         │
├─────────────────────────────────────────────────────────────┤
│  useGestureContributions (existing)  │  useDebounce         │
└────────────┬────────────────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────┐
│              Supabase Layer (Backend)                        │
├─────────────────────────────────────────────────────────────┤
│  gesture_contributions table (filtered by status='approved') │
└─────────────────────────────────────────────────────────────┘
```

### Search Flow

```
User Enters Search Term → Debounce (300ms) → Update Filters →
useGestureContributions Hook → Query Supabase → Filter Results →
Display in Grid → User Clicks Card → Show Detail Modal
```

## Components and Interfaces

### 1. Browse Page (Existing)

#### Browse Page (`/gesture/browse/page.tsx`)
- **Purpose**: Main page for browsing and searching gestures
- **Current Implementation**: Already exists with GestureBrowseHeader, GestureFilters, and GestureBrowseGrid
- **Components**:
  - GestureBrowseHeader: Page title and action buttons
  - GestureFilters: Search and filter controls
  - GestureBrowseGrid: Grid display of gesture cards
- **State Management**: useGestureContributions hook with status='approved'
- **Features**:
  - Real-time search filtering
  - Language selection
  - Responsive grid layout

### 2. Browse Header Component (Existing)

#### GestureBrowseHeader (`/components/gesture/GestureBrowseHeader.tsx`)
- **Purpose**: Display page title and navigation buttons
- **Current Implementation**: Already exists
- **Components**:
  - Page title and description
  - "My Contributions" button (links to /gesture/view)
  - "Contribute Gesture" button (links to /gesture/submit)
- **Props**: None (static component)

### 3. Filters Component (Existing)

#### GestureFilters (`/components/gesture/GestureFilters.tsx`)
- **Purpose**: Provide search and filter controls
- **Current Implementation**: Already exists with search, language, and status filters
- **Components**:
  - Search input with icon
  - Language dropdown (All, ASL, MSL)
  - Status dropdown (hidden for browse page)
- **Props**:
  ```typescript
  interface GestureFiltersProps {
    filters: GestureContributionFilters;
    onFiltersChange: (filters: Partial<GestureContributionFilters>) => void;
    userRole?: string;
    hiddenFilters?: Array<keyof GestureContributionFilters>;
    showStatusFilter?: boolean;
  }
  ```
- **Features**:
  - Real-time search input
  - Dropdown filters
  - Conditional filter visibility
  - Responsive layout

### 4. Browse Grid Component (Existing)

#### GestureBrowseGrid (`/components/gesture/GestureBrowseGrid.tsx`)
- **Purpose**: Display gestures in responsive grid layout
- **Current Implementation**: Already exists
- **Components**:
  - Grid container with responsive columns
  - Gesture cards for each item
  - Loading state
  - Empty state
- **Props**:
  ```typescript
  interface GestureBrowseGridProps {
    contributions: GestureContribution[];
    isLoading: boolean;
  }
  ```
- **Features**:
  - Responsive grid (1-4 columns based on screen size)
  - Gesture card display
  - Click to view details
  - Loading skeletons

### 5. Gesture Card Component

#### GestureCard (Part of GestureBrowseGrid)
- **Purpose**: Display individual gesture information
- **Components**:
  - Gesture word/title
  - Description preview
  - Language badge
  - Video thumbnail
  - Click handler for details
- **Data**:
  ```typescript
  interface GestureContribution {
    id: string;
    word: string;
    description: string;
    language: 'ASL' | 'MSL';
    video_url: string;
    status: 'approved';
    submitted_by: string;
    created_at: string;
  }
  ```

### 6. Gesture Detail Modal (To Be Created)

#### GestureDetailModal (`/components/gesture/GestureDetailModal.tsx`)
- **Purpose**: Display full gesture information with video playback
- **Components**:
  - Modal dialog
  - Gesture word and description
  - Language badge
  - Video player with controls
  - Close button
- **Props**:
  ```typescript
  interface GestureDetailModalProps {
    gesture: GestureContribution | null;
    isOpen: boolean;
    onClose: () => void;
  }
  ```
- **Features**:
  - Video playback controls
  - Full description display
  - Responsive modal
  - Keyboard navigation (ESC to close)

### 7. Custom Hooks

#### useGestureContributions (Existing)
```typescript
interface UseGestureContributionsReturn {
  contributions: GestureContribution[];
  isLoading: boolean;
  userRole: string;
  filters: GestureContributionFilters;
  updateFilters: (filters: Partial<GestureContributionFilters>) => void;
  refreshContributions: () => Promise<void>;
}

// Already implemented in /hooks/useGestureContributions.ts
function useGestureContributions(
  initialFilters?: Partial<GestureContributionFilters>
): UseGestureContributionsReturn
```

#### useDebounce (To Be Created)
```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}
```

## Data Models

### Gesture Contribution Model (Existing)

```typescript
interface GestureContribution {
  id: string;
  word: string;
  description: string;
  language: 'ASL' | 'MSL';
  video_url: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_by: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

interface GestureContributionFilters {
  search?: string;
  language?: 'ASL' | 'MSL';
  status?: 'pending' | 'approved' | 'rejected' | 'all';
  submitted_by?: string;
}
```

### Database Schema (Existing)

**Table: `gesture_contributions`**
```sql
CREATE TABLE gesture_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('ASL', 'MSL')),
  submitted_by UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES user_profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for search performance
CREATE INDEX idx_gesture_contributions_word ON gesture_contributions(word);
CREATE INDEX idx_gesture_contributions_status ON gesture_contributions(status);
CREATE INDEX idx_gesture_contributions_language ON gesture_contributions(language);
```

## Search Implementation

### Search Query Logic

```typescript
// In useGestureContributions hook
async function fetchGestureContributions(
  filters: GestureContributionFilters
): Promise<GestureContribution[]> {
  let query = supabase
    .from('gesture_contributions')
    .select('*')
    .eq('status', 'approved'); // Always filter to approved for browse
  
  // Apply search filter
  if (filters.search) {
    query = query.or(`word.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }
  
  // Apply language filter
  if (filters.language && filters.language !== 'all') {
    query = query.eq('language', filters.language);
  }
  
  // Order by created_at descending
  query = query.order('created_at', { ascending: false });
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
}
```

### Debounced Search

```typescript
// In GestureBrowse page component
const [searchInput, setSearchInput] = useState('');
const debouncedSearch = useDebounce(searchInput, 300);

useEffect(() => {
  updateFilters({ search: debouncedSearch });
}, [debouncedSearch, updateFilters]);
```

## Responsive Grid Layout

### Grid Breakpoints

```css
/* Mobile: < 768px - 1 column */
.gesture-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}

/* Tablet: 768px - 1024px - 2 columns */
@media (min-width: 768px) {
  .gesture-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 1024px - 1280px - 3 columns */
@media (min-width: 1024px) {
  .gesture-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Large Desktop: > 1280px - 4 columns */
@media (min-width: 1280px) {
  .gesture-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

## Error Handling

### Search Errors

| Error Type | User Message | Recovery Action |
|------------|--------------|-----------------|
| Network error | "Unable to load gestures. Please check your connection." | Retry button, show cached results |
| No results | "No gestures found matching your search." | Clear filters button, suggest contribution |
| Database error | "Something went wrong. Please try again." | Retry button, log error |

### Empty States

```typescript
// No results found
<div className="text-center py-12">
  <p className="text-lg font-medium">No gestures found</p>
  <p className="text-muted-foreground mt-2">
    Try adjusting your search or filters
  </p>
  <Button onClick={clearFilters} className="mt-4">
    Clear Filters
  </Button>
</div>

// No gestures in database
<div className="text-center py-12">
  <p className="text-lg font-medium">No gestures available yet</p>
  <p className="text-muted-foreground mt-2">
    Be the first to contribute a gesture!
  </p>
  <Button asChild className="mt-4">
    <Link href="/gesture/submit">Contribute Gesture</Link>
  </Button>
</div>
```

## Performance Optimization

### Optimization Strategies

1. **Debounced Search**: 300ms delay to reduce API calls
2. **Database Indexing**: Indexes on word, status, and language columns
3. **Query Optimization**: Filter at database level, not client-side
4. **Lazy Loading**: Load gesture videos only when detail modal opens
5. **Caching**: Cache search results in hook state
6. **Pagination**: Limit results to 50 per page (future enhancement)

### Loading States

```typescript
// Skeleton loader for grid
{isLoading && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <Card key={i} className="animate-pulse">
        <CardHeader>
          <div className="h-4 bg-muted rounded w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-muted rounded" />
        </CardContent>
      </Card>
    ))}
  </div>
)}
```

## Integration Points

### Integration with UC6 (Contribute New Gesture)

- "Contribute Gesture" button links to `/gesture/submit`
- "My Contributions" button links to `/gesture/view`
- Newly approved gestures appear in browse results

### Integration with LanguageContext

- Language filter syncs with global LanguageContext
- Selected language persists across navigation
- Default language from user profile

## Security Considerations

### Data Access

- Only approved gestures visible in browse view
- RLS policies enforce status filtering
- User authentication required to view page
- Rate limiting on search queries (10 per second)

### Input Validation

- Sanitize search input to prevent SQL injection
- Validate language filter values
- Escape special characters in search terms

## Testing Strategy

### Unit Tests
- Test search filtering logic
- Test language filter application
- Test debounce functionality
- Test empty state rendering
- Test error handling

### Integration Tests
- Test complete search flow
- Test filter combination
- Test gesture detail modal
- Test navigation to contribution pages
- Test responsive grid layout

### E2E Tests
- User searches for gesture and finds results
- User filters by language
- User clicks gesture card and views details
- User navigates to contribute gesture
- No results message displays correctly

## Future Enhancements

1. **Category Browsing**: Add gesture categories (alphabet, numbers, greetings)
2. **Advanced Filters**: Filter by difficulty, contributor, date added
3. **Sorting Options**: Sort by popularity, date, alphabetical
4. **Favorites**: Allow users to save favorite gestures
5. **Pagination**: Load more results as user scrolls
6. **Search Suggestions**: Auto-complete search terms
7. **Related Gestures**: Show similar gestures in detail view
8. **Share Gestures**: Share gesture links on social media
