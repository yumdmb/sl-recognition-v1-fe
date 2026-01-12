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
    
    const [activeTab, setActiveTab] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentQuizSet, setCurrentQuizSet] = useState<QuizSetWithProgress | null>(null);

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
        // Get quiz sets from Supabase via our service
        // Pass level for non-admins to filter server-side
        getQuizSets(language, userLevel);
    }, [language, userLevel, getQuizSets]);

    // Filter quiz sets by level (admin only) and search (all users)
    const filteredQuizSets = useMemo(() => {
        let filtered = quizSets;
        
        // Apply level filter for admins only
        if (isAdmin && activeTab !== 'all') {
            filtered = filtered.filter(set => set.level === activeTab);
        }
        
        // Apply search filter for all users
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(set =>
                set.title.toLowerCase().includes(query) ||
                set.description?.toLowerCase().includes(query)
            );
        }
        
        return filtered;
    }, [quizSets, activeTab, searchQuery, isAdmin]);

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
                    language: quizSet.language,
                    level: quizSet.level || 'beginner'
                });
            } else {
                await updateQuizSet(quizSet.id, {
                    title: quizSet.title,
                    description: quizSet.description,
                    language: quizSet.language,
                    level: quizSet.level || 'beginner'
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
                onTabChange={setActiveTab}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
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