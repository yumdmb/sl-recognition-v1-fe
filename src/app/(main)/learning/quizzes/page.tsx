'use client'

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from '@/context/LanguageContext';
import { useAdmin } from '@/context/AdminContext';
import { QuizSet, getQuizSets, saveQuizSet, deleteQuizSet } from '@/data/contentData';
import { toast } from 'sonner';
import QuizHeader from '@/components/learning/QuizHeader';
import QuizGrid from '@/components/learning/QuizGrid';
import QuizEmptyState from '@/components/learning/QuizEmptyState';
import QuizLoadingState from '@/components/learning/QuizLoadingState';
import QuizDialog from '@/components/learning/QuizDialog';

export default function QuizzesPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const { isAdmin } = useAdmin();
    const [quizSets, setQuizSets] = useState<QuizSet[]>([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentQuizSet, setCurrentQuizSet] = useState<QuizSet | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        // Get quiz sets from localStorage via our data service
        setQuizSets(getQuizSets());
        setIsLoading(false);
    }, []);

    // Filter quiz sets based on selected language
    const filteredQuizSets = quizSets.filter(set => set.language === language);

    // Function to handle adding a new quiz set
    const handleAddQuizSet = () => {
        setCurrentQuizSet({
            id: '',
            title: '',
            description: '',
            questionCount: 0,
            language: language
        });
        setEditDialogOpen(true);
    };

    // Function to handle editing a quiz set
    const handleEditQuizSet = (quizSet: QuizSet) => {
        setCurrentQuizSet({...quizSet});
        setEditDialogOpen(true);
    };

    // Function to handle deleting a quiz set
    const handleDeleteQuizSet = (id: string) => {
        if (confirm('Are you sure you want to delete this quiz set? This will also delete all associated questions.')) {
            const updatedQuizSets = deleteQuizSet(id);
            setQuizSets(updatedQuizSets);
            toast.success('Quiz set deleted successfully');
        }
    };

    // Function to save quiz set (add or update)
    const handleSaveQuizSet = (quizSet: QuizSet) => {
        // Form validation
        if (!quizSet.title || !quizSet.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const isNewQuizSet = !quizSet.id;
            if (isNewQuizSet) {
                // Generate an ID for new quiz sets based on language and title
                const titleSlug = quizSet.title.toLowerCase().replace(/\s+/g, '-');
                quizSet.id = `${quizSet.language.toLowerCase()}-${titleSlug}`;
            }
            
            const updatedQuizSets = saveQuizSet(quizSet);
            setQuizSets(updatedQuizSets);
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

            {isLoading ? (
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