'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminDashboard from '@/components/AdminDashboard';
import UserDashboard from '@/components/UserDashboard';
import ProficiencyTestPrompt from '@/components/proficiency-test/ProficiencyTestPrompt';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  useEffect(() => {
    // Check if the user has taken the test. We assume proficiency_level is null if not taken.
    // We also add a check to see if we've already shown the prompt to avoid showing it again on re-renders.
    if (currentUser && currentUser.proficiency_level === null && !sessionStorage.getItem('proficiencyPromptShown')) {
      setIsPromptOpen(true);
      sessionStorage.setItem('proficiencyPromptShown', 'true');
    }
  }, [currentUser]);

  const handleClosePrompt = () => {
    setIsPromptOpen(false);
  };

  return (
    <>
      <ProficiencyTestPrompt isOpen={isPromptOpen} onClose={handleClosePrompt} />
      {currentUser?.role === 'admin' ? (
        <AdminDashboard />
      ) : (
        <UserDashboard userRole={currentUser?.role as 'non-deaf' | 'deaf' || 'non-deaf'} />
      )}
    </>
  );
}