'use client'

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAdmin } from '@/context/AdminContext';
import { Tutorial, getTutorials, saveTutorial, deleteTutorial } from '@/data/contentData';
import { toast } from 'sonner';
import TutorialHeader from '@/components/learning/TutorialHeader';
import TutorialGrid from '@/components/learning/TutorialGrid';
import TutorialEmptyState from '@/components/learning/TutorialEmptyState';
import TutorialLoadingState from '@/components/learning/TutorialLoadingState';
import TutorialDialog from '@/components/learning/TutorialDialog';

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const { language } = useLanguage();
  const { isAdmin } = useAdmin();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentTutorial, setCurrentTutorial] = useState<Tutorial | null>(null);

  useEffect(() => {
    // Get tutorials from localStorage via our data service
    setTutorials(getTutorials());
    setIsLoading(false);
  }, []);

  // Filter tutorials by both level and selected language
  const filteredTutorials = tutorials.filter(tutorial => 
    (activeTab === 'all' || tutorial.level === activeTab) && 
    tutorial.language === language
  );

  // Function to handle adding a new tutorial
  const handleAddTutorial = () => {
    setCurrentTutorial({
      id: '',
      title: '',
      description: '',
      thumbnailUrl: 'https://placehold.co/400x225?text=New+Tutorial',
      videoUrl: '',
      duration: '00:00',
      level: 'beginner',
      progress: 0,
      language: language
    });
    setEditDialogOpen(true);
  };

  // Function to handle editing a tutorial
  const handleEditTutorial = (tutorial: Tutorial) => {
    setCurrentTutorial({...tutorial});
    setEditDialogOpen(true);
  };

  // Function to handle deleting a tutorial
  const handleDeleteTutorial = (id: string) => {
    if (confirm('Are you sure you want to delete this tutorial?')) {
      const updatedTutorials = deleteTutorial(id);
      setTutorials(updatedTutorials);
      toast.success('Tutorial deleted successfully');
    }
  };

  // Function to save tutorial (add or update)
  const handleSaveTutorial = (tutorial: Tutorial) => {
    // Form validation
    if (!tutorial.title || !tutorial.description || !tutorial.videoUrl) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const updatedTutorials = saveTutorial(tutorial);
      setTutorials(updatedTutorials);
      setEditDialogOpen(false);
      toast.success(`Tutorial ${tutorial.id ? 'updated' : 'added'} successfully`);
    } catch (error) {
      toast.error('Error saving tutorial');
      console.error(error);
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
      
      {isLoading ? (
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