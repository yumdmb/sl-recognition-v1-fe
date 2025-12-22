# Additional Error-Free and Error Handling Examples - SignBridge

Beyond the 6 main error handling categories already documented, here are 5 additional patterns implemented in the SignBridge application.

---

## 1. Loading States & Skeleton UI

Skeleton loaders provide visual feedback during data fetching, preventing blank screens and improving perceived performance. Users see placeholder content that matches the final layout.

### Code Examples:

**Gesture Browse Grid - Skeleton Loader** (`src/components/gesture/GestureBrowseGrid.tsx`)
```typescript
import { Skeleton } from "@/components/ui/skeleton";

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <Skeleton className="relative aspect-video" />
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <div className="flex justify-between items-center pt-2 border-t">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-8 w-1/4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function GestureBrowseGrid({ contributions, isLoading }: GestureBrowseGridProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  // ... render actual content
}
```

**Proficiency Test - Loading Skeleton** (`src/app/proficiency-test/[testId]/page.tsx`)
```typescript
if (proficiencyTestLoading || !currentTest) {
  return (
    <div className="container mx-auto py-8 flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
```

**Screenshot Location:** `/gesture-recognition/search` or `/proficiency-test/[testId]` - Refresh page to see skeleton loading

---

## 2. Empty State Handling

When no data exists, dedicated empty state components guide users on what to do next instead of showing blank pages. This improves UX and reduces confusion.

### Code Examples:

**Gesture Browse - Empty State** (`src/components/gesture/GestureBrowseGrid.tsx`)
```typescript
// Empty state component
function EmptyState() {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg">No gestures found</p>
      <p className="text-gray-400 text-sm mt-2">
        Try adjusting your filters or check back later
      </p>
    </div>
  );
}

export default function GestureBrowseGrid({ contributions, isLoading }: GestureBrowseGridProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  
  const approvedContributions = contributions.filter(c => c.status === 'approved');

  if (approvedContributions.length === 0) {
    return <EmptyState />;
  }
  // ... render grid
}
```

**Quiz Empty State** (`src/components/learning/QuizEmptyState.tsx`)
```typescript
interface QuizEmptyStateProps {
  language: string;
}

const QuizEmptyState: React.FC<QuizEmptyStateProps> = ({ language }) => {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <p className="text-gray-500">
          No quizzes available for {language} at the moment.
        </p>
      </CardContent>
    </Card>
  );
};
```

**Gesture View Empty State** (`src/components/gesture/GestureViewEmptyState.tsx`)
```typescript
interface GestureViewEmptyStateProps {
  userRole?: string;
  isMySubmissions?: boolean;
}

export default function GestureViewEmptyState({
  userRole,
  isMySubmissions = false,
}: GestureViewEmptyStateProps) {
  return (
    <Card>
      <CardContent className="text-center py-12">
        {isMySubmissions ? (
          <>
            <p className="text-gray-500 text-lg">You haven't submitted any gestures yet</p>
            <Link href="/gesture-recognition/upload">
              <Button className="mt-4">Submit Your First Gesture</Button>
            </Link>
          </>
        ) : (
          <p className="text-gray-500">No gestures found matching your criteria</p>
        )}
      </CardContent>
    </Card>
  );
}
```

**Screenshot Location:** `/gesture-recognition/search` with filters that return no results, or `/learning/quizzes` with no quizzes

---

## 3. Graceful Degradation & Fallbacks

When primary features fail (GPU, network, database), the system falls back to alternative methods ensuring the app remains functional.

### Code Examples:

**Hand Detection - GPU to CPU Fallback** (`src/context/HandDetectionContext.tsx`)
```typescript
const initializeHandDetector = async () => {
  try {
    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

    // Try GPU first, fallback to CPU if GPU fails
    let landmarker: HandLandmarker | null = null;
    
    try {
      // Attempt GPU delegate first (faster)
      landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "/models/hand_landmarker.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
      });
      console.log("GPU delegate initialized!");
    } catch (gpuError) {
      console.warn("GPU delegate failed, falling back to CPU:", gpuError);
      
      // Fallback to CPU delegate
      landmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "/models/hand_landmarker.task",
          delegate: "CPU",
        },
        runningMode: "VIDEO",
        numHands: 2,
      });
      console.log("CPU delegate initialized as fallback!");
    }

    setHandLandmarker(landmarker);
    setIsLoading(false);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to load hand detection model");
    setIsLoading(false);
  }
};
```

**Auth Context - Profile Fallback** (`src/context/AuthContext.tsx`)
```typescript
const convertSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User> => {
  // Fallback user data from metadata (always available)
  const metadata = supabaseUser.user_metadata || {};
  const fallbackUser: User = {
    id: supabaseUser.id,
    name: metadata.name || metadata.full_name || supabaseUser.email?.split('@')[0] || 'User',
    email: supabaseUser.email || '',
    role: (metadata.role as 'non-deaf' | 'admin' | 'deaf') || 'non-deaf',
    proficiency_level: null,
  };

  try {
    // Try to get user profile from database
    const profile = await UserService.getUserProfile(supabaseUser.id);
    
    if (profile) {
      return { /* full profile data */ };
    } else {
      console.info('No profile found in database, using metadata fallback');
    }
  } catch {
    console.info('Failed to fetch user profile from database, using fallback.');
  }
  
  return fallbackUser; // Always return something usable
};
```

**Screenshot Location:** Browser DevTools Console - showing "GPU delegate failed, falling back to CPU" message

---

## 4. Granular Loading States

Instead of one global loading state, separate loading indicators for different sections allow partial page rendering and better UX.

### Code Examples:

**Learning Context - Separate Loading States** (`src/context/LearningContext.tsx`)
```typescript
interface LearningContextProps {
  // Loaders - separate loading states for each section
  isLoading: boolean; // Keep for backward compatibility
  tutorialsLoading: boolean;
  materialsLoading: boolean;
  quizSetsLoading: boolean;
  proficiencyTestLoading: boolean;
  // ... other props
}

export const LearningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tutorialsLoading, setTutorialsLoading] = useState(false);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [quizSetsLoading, setQuizSetsLoading] = useState(false);
  const [proficiencyTestLoading, setProficiencyTestLoading] = useState(false);

  const getTutorials = useCallback(async (language?: 'ASL' | 'MSL') => {
    try {
      setTutorialsLoading(true); // Only tutorials loading
      const data = await TutorialService.getTutorials(currentUser?.id, language);
      setTutorials(data);
    } catch (error) {
      handleError(error, 'fetch tutorials');
    } finally {
      setTutorialsLoading(false);
    }
  }, [currentUser?.id]);

  const getQuizSets = useCallback(async (language?: 'ASL' | 'MSL') => {
    try {
      setQuizSetsLoading(true); // Only quizzes loading
      const data = await QuizService.getQuizSets(currentUser?.id, language);
      setQuizSets(data);
    } catch (error) {
      handleError(error, 'fetch quizzes');
    } finally {
      setQuizSetsLoading(false);
    }
  }, [currentUser?.id]);
};
```

**Admin Context - Role Loading State** (`src/context/AdminContext.tsx`)
```typescript
interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
  isRoleLoading: boolean; // Separate loading for role check
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(true);
  const { currentUser, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (isAuthLoading) {
      setIsRoleLoading(true);
      return;
    }

    if (currentUser) {
      const isAdminUser = currentUser.role === 'admin';
      setIsAdmin(isAdminUser);
      setIsRoleLoading(false);
    } else {
      setIsAdmin(false);
      setIsRoleLoading(false);
    }
  }, [currentUser, isAuthLoading]);
}
```

**Screenshot Location:** `/dashboard` - Tutorials section loads independently from Quizzes section

---

## 5. Critical vs Non-Critical Error Classification

Errors are classified by severity - critical errors (auth failures, not found) show blocking UI, while non-critical errors (network hiccups) allow retry without disrupting the user flow.

### Code Examples:

**Proficiency Test - Error Classification** (`src/app/proficiency-test/[testId]/page.tsx`)
```typescript
const [error, setError] = useState<string | null>(null);
const [retryCount, setRetryCount] = useState(0);
const [isCriticalError, setIsCriticalError] = useState(false);

useEffect(() => {
  const loadTest = async () => {
    try {
      await startTest(testId);
      setError(null);
      setIsCriticalError(false);
    } catch (err) {
      // Determine if this is a critical error
      const isCritical = retryCount >= 2 || 
                        (err instanceof Error && (
                          err.message.includes('not found') || 
                          err.message.includes('unauthorized')
                        ));
      
      setIsCriticalError(isCritical);
      
      if (isCritical) {
        setError('Unable to load test. Please try again later.');
      } else {
        setError('Failed to load test. Retrying...');
        // Auto-retry for non-critical errors
        setTimeout(() => setRetryCount(prev => prev + 1), 2000);
      }
    }
  };
  
  loadTest();
}, [testId, retryCount]);

// Render different UI based on error severity
if (isCriticalError) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
      <Button onClick={() => router.push('/proficiency-test/select')}>
        Back to Test Selection
      </Button>
    </Alert>
  );
}

if (error && !isCriticalError) {
  return (
    <Alert>
      <AlertDescription>
        {error}
        <Button onClick={() => setRetryCount(prev => prev + 1)}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry Now
        </Button>
      </AlertDescription>
    </Alert>
  );
}
```

**Quiz Submission - Retry Logic** (`src/app/proficiency-test/[testId]/page.tsx`)
```typescript
const [showManualRetry, setShowManualRetry] = useState(false);

const handleFinish = async () => {
  setIsSubmitting(true);
  setError(null);
  
  try {
    // Submit all answers
    for (const question of currentTest.questions) {
      const choiceId = userAnswers[question.id];
      if (choiceId) {
        await submitAnswerToContext(question.id, choiceId);
      }
    }

    const result = await submitTest();
    router.push(`/proficiency-test/results?attemptId=${result.attemptId}`);
  } catch (err) {
    submissionRetryCount++;
    
    if (submissionRetryCount >= 3) {
      // Show manual retry option after 3 failed attempts
      setShowManualRetry(true);
      setError('Failed to submit test after multiple attempts. Your answers have been saved. Please check your connection and try again.');
    } else {
      // Auto-retry for first few attempts
      setError('Submission failed. Retrying...');
      setTimeout(() => handleFinish(), 2000);
    }
  } finally {
    if (showManualRetry || submissionRetryCount >= 3) {
      setIsSubmitting(false);
    }
  }
};
```

**Screenshot Location:** `/proficiency-test/[testId]` - Disconnect network briefly to see retry UI

---

## Summary Table

| Pattern | Purpose | Key Benefit |
|---------|---------|-------------|
| **Skeleton UI** | Visual placeholder during loading | Better perceived performance |
| **Empty States** | Guide users when no data exists | Reduces confusion, provides next steps |
| **Graceful Degradation** | Fallback when features fail | App remains functional |
| **Granular Loading** | Independent loading per section | Partial page rendering |
| **Error Classification** | Different handling by severity | Better UX for recoverable errors |

---

## Quick Screenshot Checklist

1. ✅ `/gesture-recognition/search` → Refresh page → **Skeleton loading grid**
2. ✅ `/gesture-recognition/search` → Filter with no results → **Empty state message**
3. ✅ `/avatar/generate` → Check console → **"GPU/CPU delegate" fallback message**
4. ✅ `/dashboard` → Watch sections load independently → **Granular loading states**
5. ✅ `/proficiency-test/[testId]` → Disconnect network → **Retry UI with error classification**
