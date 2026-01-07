'use client'

import React, { useEffect, useState, useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAdmin } from '@/context/AdminContext';
import { useLearning } from '@/context/LearningContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import TutorialHeader from '@/components/learning/TutorialHeader';
import TutorialGrid from '@/components/learning/TutorialGrid';
import TutorialEmptyState from '@/components/learning/TutorialEmptyState';
import TutorialLoadingState from '@/components/learning/TutorialLoadingState';
import TutorialDialog from '@/components/learning/TutorialDialog';
import type { TutorialWithProgress } from '@/types/database';

// Helper to convert proficiency level to lowercase
const toLowerLevel = (level: string | null | undefined): 'beginner' | 'intermediate' | 'advanced' | undefined => {
  if (!level) return undefined;
  return level.toLowerCase() as 'beginner' | 'intermediate' | 'advanced';
};

export default function TutorialsPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentTutorial, setCurrentTutorial] = useState<TutorialWithProgress | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const { language } = useLanguage();
  const { isAdmin } = useAdmin();
  const { currentUser } = useAuth();
  const { 
    tutorials, 
    tutorialsLoading, 
    getTutorials, 
    createTutorial, 
    updateTutorial, 
    deleteTutorial: deleteFromDB
  } = useLearning();

  // Get the user's proficiency level for the currently selected language (only for non-admins)
  const userLevel = useMemo(() => {
    if (isAdmin) return undefined; // Admins see all levels
    
    // Use language-specific proficiency level based on selected language
    if (language === 'ASL') {
      return toLowerLevel(currentUser?.asl_proficiency_level);
    } else if (language === 'MSL') {
      return toLowerLevel(currentUser?.msl_proficiency_level);
    }
    
    // Fallback to legacy proficiency_level
    return toLowerLevel(currentUser?.proficiency_level);
  }, [isAdmin, currentUser?.asl_proficiency_level, currentUser?.msl_proficiency_level, currentUser?.proficiency_level, language]);

  useEffect(() => {
    // Load tutorials when component mounts or language/level changes
    // Pass level for non-admins to filter server-side
    getTutorials(language, userLevel);
  }, [language, userLevel, getTutorials]);

  // Reset saving state when tutorialsLoading changes
  useEffect(() => {
    if (!tutorialsLoading && isSaving) {
      setIsSaving(false);
    }
  }, [tutorialsLoading, isSaving]);

  // Filter tutorials by level (only used by admins with level tabs)
  const filteredTutorials = useMemo(() => {
    if (!isAdmin) return tutorials; // Non-admins already get filtered from server
    return tutorials.filter(tutorial => 
      activeTab === 'all' || tutorial.level === activeTab
    );
  }, [tutorials, activeTab, isAdmin]);  // Function to handle adding a new tutorial
  const handleAddTutorial = () => {    setCurrentTutorial({
      id: '',
      title: '',
      description: '',
      thumbnail_url: null,
      video_url: '',
      level: 'beginner',
      language: language,
      created_by: currentUser?.id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'not-started'
    });
    setEditDialogOpen(true);
  };

  // Function to handle editing a tutorial
  const handleEditTutorial = (tutorial: TutorialWithProgress) => {
    setCurrentTutorial({...tutorial});
    setEditDialogOpen(true);
  };
  // Function to handle deleting a tutorial
  const handleDeleteTutorial = async (id: string) => {
    if (confirm('Are you sure you want to delete this tutorial?')) {
      try {
        await deleteFromDB(id);
      } catch (error) {
        console.error('Error deleting tutorial:', error);
      }
    }
  };
  // Function to handle dialog close
  const handleDialogClose = (open: boolean) => {
    // Don't allow closing dialog while saving
    if (!open && isSaving) return;
    
    setEditDialogOpen(open);
    if (!open) {
      // Reset current tutorial and saving state when dialog is closed
      setCurrentTutorial(null);
      setIsSaving(false);
    }
  };// Function to save tutorial (add or update)
  const handleSaveTutorial = async (tutorial: TutorialWithProgress) => {
    // Prevent multiple simultaneous saves
    if (isSaving) return;
    
    // Form validation
    if (!tutorial.title || !tutorial.description || !tutorial.video_url) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      if (tutorial.id) {        // Update existing tutorial
        await updateTutorial(tutorial.id, {
          title: tutorial.title,
          description: tutorial.description,
          thumbnail_url: tutorial.thumbnail_url,
          video_url: tutorial.video_url,
          level: tutorial.level,
          language: tutorial.language
        });
      } else {        // Create new tutorial
        await createTutorial({
          title: tutorial.title,
          description: tutorial.description,
          thumbnail_url: tutorial.thumbnail_url,
          video_url: tutorial.video_url,
          level: tutorial.level,
          language: tutorial.language
        });
      }
      // Close dialog only after successful save
      setEditDialogOpen(false);
      setCurrentTutorial(null);
    } catch (error) {
      console.error('Error saving tutorial:', error);
      toast.error('Failed to save tutorial. Please try again.');
      // Don't close dialog on error so user can retry
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <TutorialHeader
        onTabChange={setActiveTab}
        isAdmin={isAdmin}
        onAddTutorial={handleAddTutorial}
        userLevel={currentUser?.proficiency_level || undefined}
      />
      
      {tutorialsLoading ? (
        <TutorialLoadingState />
      ) : filteredTutorials.length > 0 ? (
        <TutorialGrid
          tutorials={filteredTutorials}
          isAdmin={isAdmin}
          onEditTutorial={handleEditTutorial}
          onDeleteTutorial={handleDeleteTutorial}
        />
      ) : (
        <TutorialEmptyState language={language} />
      )}      <TutorialDialog
        open={editDialogOpen}
        onOpenChange={handleDialogClose}
        tutorial={currentTutorial}
        onTutorialChange={setCurrentTutorial}
        onSave={handleSaveTutorial}
        isSaving={isSaving}
      />
    </>
  );
} 