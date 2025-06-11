'use client'

import React, { useEffect, useState } from 'react';
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
import type { TutorialWithProgress, Database } from '@/types/database';

export default function TutorialsPage() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentTutorial, setCurrentTutorial] = useState<TutorialWithProgress | null>(null);
  
  const { language } = useLanguage();
  const { isAdmin } = useAdmin();
  const { currentUser } = useAuth();  const { 
    tutorials, 
    tutorialsLoading, 
    getTutorials, 
    createTutorial, 
    updateTutorial, 
    deleteTutorial: deleteFromDB,
    updateTutorialProgress 
  } = useLearning();

  useEffect(() => {
    // Load tutorials when component mounts or language changes
    getTutorials(language);
  }, [language]);

  // Filter tutorials by level
  const filteredTutorials = tutorials.filter(tutorial => 
    activeTab === 'all' || tutorial.level === activeTab
  );

  // Function to handle adding a new tutorial
  const handleAddTutorial = () => {
    setCurrentTutorial({
      id: '',
      title: '',
      description: '',
      thumbnail_url: null,
      video_url: '',
      duration: '00:00',
      level: 'beginner',
      language: language,
      created_by: currentUser?.id || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      progress: 0
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

  // Function to save tutorial (add or update)
  const handleSaveTutorial = async (tutorial: TutorialWithProgress) => {
    // Form validation
    if (!tutorial.title || !tutorial.description || !tutorial.video_url) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (tutorial.id) {
        // Update existing tutorial
        await updateTutorial(tutorial.id, {
          title: tutorial.title,
          description: tutorial.description,
          thumbnail_url: tutorial.thumbnail_url,
          video_url: tutorial.video_url,
          duration: tutorial.duration,
          level: tutorial.level,
          language: tutorial.language
        });
      } else {
        // Create new tutorial
        await createTutorial({
          title: tutorial.title,
          description: tutorial.description,
          thumbnail_url: tutorial.thumbnail_url,
          video_url: tutorial.video_url,
          duration: tutorial.duration,
          level: tutorial.level,
          language: tutorial.language
        });
      }
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error saving tutorial:', error);
    }
  };

  return (
    <>
      <TutorialHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isAdmin={isAdmin}
        onAddTutorial={handleAddTutorial}
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
      )}

      <TutorialDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        tutorial={currentTutorial}
        onTutorialChange={setCurrentTutorial}
        onSave={handleSaveTutorial}
      />
    </>
  );
} 