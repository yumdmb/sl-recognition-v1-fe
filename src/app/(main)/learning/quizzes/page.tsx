'use client'

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from '@/context/LanguageContext';
import { useAdmin } from '@/context/AdminContext';
import { useAuth } from '@/context/AuthContext';
import { useLearning } from '@/context/LearningContext';
import { toast } from 'sonner';
import QuizHeader from '@/components/learning/QuizHeader';
import QuizGrid from '@/components/learning/QuizGrid';
import QuizEmptyState from '@/components/learning/QuizEmptyState';
import QuizLoadingState from '@/components/learning/QuizLoadingState';
import QuizDialog from '@/components/learning/QuizDialog';
import { QuizSetWithProgress } from '@/types/database';

// Helper to convert proficiency level to lowercase
const toLowerLevel = (level: string | null | undefined): 'beginner' | 'intermediate' | 'advanced' | undefined => {
  if (!level) return undefined;
  return level.toLowerCase() as 'beginner' | 'intermediate' | 'advanced';
};

export default function QuizzesPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const { isAdmin } = useAdmin();
    const { currentUser } = useAuth();
    const { 
        quizSets,
        quizSetsLoading,
        getQuizSets,
        createQuizSet,
        updateQuizSet,
        deleteQuizSet
    } = useLearning();
    
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentQuizSet, setCurrentQuizSet] = useState<QuizSetWithProgress | null>(null);

    // Get the user's proficiency level for filtering (only for non-admins)
    const userLevel = useMemo(() => {
        if (isAdmin) return undefined; // Admins see all levels
        return toLowerLevel(currentUser?.proficiency_level);
    }, [isAdmin, currentUser?.proficiency_level]);
    
    useEffect(() => {
        // Get quiz sets from Supabase via our service
        // Pass level for non-admins to filter server-side
        getQuizSets(language, userLevel);
    }, [language, userLevel]); // Removed getQuizSets from dependencies to prevent infinite loop

    // Filter quiz sets based on selected language (redundant now, but kept for safety)
    const filteredQuizSets = quizSets.filter(set => set.language === language);

    // Function to handle adding a new quiz set
    const handleAddQuizSet = () => {
        setCurrentQuizSet({
            id: '',
            title: '',
            description: '',
            level: 'beginner', // Default level for new quiz sets
            questionCount: 0,
            language: language,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: currentUser?.id || null,
            progress: undefined  // We use undefined instead of null
        });
        setEditDialogOpen(true);
    };

    // Function to handle editing a quiz set
    const handleEditQuizSet = (quizSet: QuizSetWithProgress) => {
        setCurrentQuizSet({...quizSet});
        setEditDialogOpen(true);
    };

    // Function to handle deleting a quiz set
    const handleDeleteQuizSet = async (id: string) => {
        if (confirm('Are you sure you want to delete this quiz set? This will also delete all associated questions.')) {
            try {
                await deleteQuizSet(id);
                toast.success('Quiz set deleted successfully');
            } catch (error) {
                toast.error('Error deleting quiz set');
                console.error(error);
            }
        }
    };

    // Function to save quiz set (add or update)
    const handleSaveQuizSet = async (quizSet: QuizSetWithProgress) => {
        // Form validation
        if (!quizSet.title || !quizSet.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const isNewQuizSet = !quizSet.id || quizSet.id === '';
            
            if (isNewQuizSet) {
                await createQuizSet({
                    title: quizSet.title,
                    description: quizSet.description,
                    language: quizSet.language
                });
            } else {
                await updateQuizSet(quizSet.id, {
                    title: quizSet.title,
                    description: quizSet.description,
                    language: quizSet.language
                });
            }
            
            setEditDialogOpen(false);
            toast.success(`Quiz set ${isNewQuizSet ? 'added' : 'updated'} successfully`);
        } catch (error) {
            toast.error('Error saving quiz set');
            console.error(error);
        }
    };

    // Function to navigate to edit questions page
    const handleEditQuestions = (setId: string) => {
        router.push(`/learning/quizzes/${setId}/edit`);
    };

    // Function to start a quiz
    const handleStartQuiz = (setId: string) => {
        router.push(`/learning/quizzes/${setId}`);
    };

    return (
        <>
            <QuizHeader
                isAdmin={isAdmin}
                onAddQuizSet={handleAddQuizSet}
            />

            {quizSetsLoading ? (
                <QuizLoadingState />
            ) : filteredQuizSets.length > 0 ? (
                <QuizGrid
                    quizSets={filteredQuizSets}
                    isAdmin={isAdmin}
                    onStartQuiz={handleStartQuiz}
                    onEditQuestions={handleEditQuestions}
                    onEditQuizSet={handleEditQuizSet}
                    onDeleteQuizSet={handleDeleteQuizSet}
                />
            ) : (
                <QuizEmptyState language={language} />
            )}

            <QuizDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                quizSet={currentQuizSet}
                onQuizSetChange={setCurrentQuizSet}
                onSave={handleSaveQuizSet}
            />
        </>
    );
}