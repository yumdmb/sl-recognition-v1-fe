'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAdmin } from '@/context/AdminContext';
import AdminDashboard from '@/components/AdminDashboard';
import UserDashboard from '@/components/UserDashboard';
import ProficiencyTestPrompt from '@/components/proficiency-test/ProficiencyTestPrompt';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const { isAdmin, isRoleLoading } = useAdmin();
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  // Use stable primitive values for dependencies to prevent infinite re-renders
  const userId = currentUser?.id;
  const proficiencyLevel = currentUser?.proficiency_level;

  useEffect(() => {
    // Check if the user has taken the test. We assume proficiency_level is null if not taken.
    // We also add a check to see if we've already shown the prompt to avoid showing it again.
    // Using localStorage for persistence across sessions
    // Admin users don't need to take the proficiency test
    if (!userId || isAdmin) return;
    
    const promptKey = `proficiencyPromptShown_${userId}`;
    
    if (proficiencyLevel === null && !localStorage.getItem(promptKey)) {
      setIsPromptOpen(true);
    }
  }, [userId, proficiencyLevel, isAdmin]);

  const handleClosePrompt = () => {
    setIsPromptOpen(false);
    // Store user preference to not show prompt again
    if (currentUser?.id) {
      localStorage.setItem(`proficiencyPromptShown_${currentUser.id}`, 'true');
    }
  };

  // Show loading state while role is being determined to prevent UI flicker
  if (isAuthLoading || isRoleLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-signlang-primary mx-auto" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Use isAdmin from AdminContext (which properly checks role from database)
  const showAdminDashboard = isAdmin || currentUser?.role === 'admin';

  return (
    <>
      <ProficiencyTestPrompt isOpen={isPromptOpen} onClose={handleClosePrompt} />
      {showAdminDashboard ? (
        <AdminDashboard />
      ) : (
        <UserDashboard 
          userRole={currentUser?.role as 'non-deaf' | 'deaf' || 'non-deaf'} 
          userName={currentUser?.name}
        />
      )}
    </>
  );
}