'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "sonner";
import { useAuth } from './AuthContext';
import { TutorialService } from '@/lib/services/tutorialService';
import { MaterialService } from '@/lib/services/materialService';
import { QuizService } from '@/lib/services/quizService';
import type { 
  TutorialWithProgress, 
  Material, 
  QuizSetWithProgress,
  QuizSetWithQuestions,
  Tutorial,
  QuizSet,
  QuizQuestion,
  Database 
} from '@/types/database';

interface LearningContextProps {
  // Loaders
  isLoading: boolean;
  
  // Tutorials
  tutorials: TutorialWithProgress[];
  getTutorials: (language?: 'ASL' | 'MSL') => Promise<void>;
  createTutorial: (tutorial: Database['public']['Tables']['tutorials']['Insert']) => Promise<void>;
  updateTutorial: (id: string, updates: Database['public']['Tables']['tutorials']['Update']) => Promise<void>;
  deleteTutorial: (id: string) => Promise<void>;
  updateTutorialProgress: (tutorialId: string, progress: number) => Promise<void>;
  
  // Materials
  materials: Material[];
  getMaterials: (language?: 'ASL' | 'MSL') => Promise<void>;
  createMaterial: (material: Database['public']['Tables']['materials']['Insert']) => Promise<void>;
  updateMaterial: (id: string, updates: Database['public']['Tables']['materials']['Update']) => Promise<void>;
  deleteMaterial: (id: string) => Promise<void>;
  
  // Quizzes
  quizSets: QuizSetWithProgress[];
  getQuizSets: (language?: 'ASL' | 'MSL') => Promise<void>;
  getQuizSetWithQuestions: (id: string) => Promise<QuizSetWithQuestions | null>;
  createQuizSet: (quizSet: Database['public']['Tables']['quiz_sets']['Insert']) => Promise<void>;
  updateQuizSet: (id: string, updates: Database['public']['Tables']['quiz_sets']['Update']) => Promise<void>;
  deleteQuizSet: (id: string) => Promise<void>;
  createQuizQuestion: (question: Database['public']['Tables']['quiz_questions']['Insert']) => Promise<void>;
  updateQuizQuestion: (id: string, updates: Database['public']['Tables']['quiz_questions']['Update']) => Promise<void>;
  deleteQuizQuestion: (id: string) => Promise<void>;
  submitQuizAnswers: (quizSetId: string, answers: { questionId: string; answer: string }[]) => Promise<{ score: number; totalQuestions: number; passed: boolean }>;
}

const LearningContext = createContext<LearningContextProps | null>(null);

export const LearningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [tutorials, setTutorials] = useState<TutorialWithProgress[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [quizSets, setQuizSets] = useState<QuizSetWithProgress[]>([]);
  // Helper function to handle errors
  const handleError = (error: any, operation: string) => {
    console.error(`Error in ${operation}:`, error);
    
    // Log more detailed error information
    if (error && typeof error === 'object') {
      console.error('Detailed error info:', {
        message: error.message,
        code: error.code,
        hint: error.hint,
        details: error.details,
        stack: error.stack
      });
    }
    
    // Provide more helpful error messages
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error?.message) {
      errorMessage = error.message;
    } else if (error?.code) {
      switch (error.code) {
        case 'JWT_EXPIRED':
          errorMessage = 'Your session has expired. Please sign in again.';
          break;
        case 'PGRST116':
          errorMessage = 'Access denied. Please check your permissions.';
          break;
        default:
          errorMessage = `Database error: ${error.code}`;
      }
    }
    
    toast.error(`Failed to ${operation}`, {
      description: errorMessage
    });
  };

  // Tutorials
  const getTutorials = async (language?: 'ASL' | 'MSL') => {
    try {
      setIsLoading(true);
      const data = await TutorialService.getTutorials(currentUser?.id, language);
      setTutorials(data);
    } catch (error) {
      handleError(error, 'fetch tutorials');
    } finally {
      setIsLoading(false);
    }
  };

  const createTutorial = async (tutorial: Database['public']['Tables']['tutorials']['Insert']) => {
    try {
      setIsLoading(true);
      const newTutorial = await TutorialService.createTutorial({
        ...tutorial,
        created_by: currentUser?.id
      });
      setTutorials(prev => [{ ...newTutorial, progress: 0 }, ...prev]);
      toast.success('Tutorial created successfully');
    } catch (error) {
      handleError(error, 'create tutorial');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTutorial = async (id: string, updates: Database['public']['Tables']['tutorials']['Update']) => {
    try {
      setIsLoading(true);
      const updatedTutorial = await TutorialService.updateTutorial(id, updates);
      setTutorials(prev => prev.map(t => 
        t.id === id ? { ...updatedTutorial, progress: t.progress } : t
      ));
      toast.success('Tutorial updated successfully');
    } catch (error) {
      handleError(error, 'update tutorial');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTutorial = async (id: string) => {
    try {
      setIsLoading(true);
      await TutorialService.deleteTutorial(id);
      setTutorials(prev => prev.filter(t => t.id !== id));
      toast.success('Tutorial deleted successfully');
    } catch (error) {
      handleError(error, 'delete tutorial');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTutorialProgress = async (tutorialId: string, progress: number) => {
    try {
      if (!currentUser) return;
      await TutorialService.updateProgress(currentUser.id, tutorialId, progress);
      setTutorials(prev => prev.map(t => 
        t.id === tutorialId ? { ...t, progress } : t
      ));
    } catch (error) {
      handleError(error, 'update tutorial progress');
    }
  };

  // Materials
  const getMaterials = async (language?: 'ASL' | 'MSL') => {
    try {
      setIsLoading(true);
      const data = await MaterialService.getMaterials(language);
      setMaterials(data);
    } catch (error) {
      handleError(error, 'fetch materials');
    } finally {
      setIsLoading(false);
    }
  };

  const createMaterial = async (material: Database['public']['Tables']['materials']['Insert']) => {
    try {
      setIsLoading(true);
      const newMaterial = await MaterialService.createMaterial({
        ...material,
        created_by: currentUser?.id
      });
      setMaterials(prev => [newMaterial, ...prev]);
      toast.success('Material created successfully');
    } catch (error) {
      handleError(error, 'create material');
    } finally {
      setIsLoading(false);
    }
  };

  const updateMaterial = async (id: string, updates: Database['public']['Tables']['materials']['Update']) => {
    try {
      setIsLoading(true);
      const updatedMaterial = await MaterialService.updateMaterial(id, updates);
      setMaterials(prev => prev.map(m => m.id === id ? updatedMaterial : m));
      toast.success('Material updated successfully');
    } catch (error) {
      handleError(error, 'update material');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMaterial = async (id: string) => {
    try {
      setIsLoading(true);
      await MaterialService.deleteMaterial(id);
      setMaterials(prev => prev.filter(m => m.id !== id));
      toast.success('Material deleted successfully');
    } catch (error) {
      handleError(error, 'delete material');
    } finally {
      setIsLoading(false);
    }
  };

  // Quizzes
  const getQuizSets = async (language?: 'ASL' | 'MSL') => {
    try {
      setIsLoading(true);
      const data = await QuizService.getQuizSets(currentUser?.id, language);
      setQuizSets(data);
    } catch (error) {
      handleError(error, 'fetch quiz sets');
    } finally {
      setIsLoading(false);
    }
  };

  const getQuizSetWithQuestions = async (id: string): Promise<QuizSetWithQuestions | null> => {
    try {
      return await QuizService.getQuizSetWithQuestions(id);
    } catch (error) {
      handleError(error, 'fetch quiz questions');
      return null;
    }
  };

  const createQuizSet = async (quizSet: Database['public']['Tables']['quiz_sets']['Insert']) => {
    try {
      setIsLoading(true);
      const newQuizSet = await QuizService.createQuizSet({
        ...quizSet,
        created_by: currentUser?.id
      });
      setQuizSets(prev => [{ ...newQuizSet, questionCount: 0 }, ...prev]);
      toast.success('Quiz set created successfully');
    } catch (error) {
      handleError(error, 'create quiz set');
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuizSet = async (id: string, updates: Database['public']['Tables']['quiz_sets']['Update']) => {
    try {
      setIsLoading(true);
      const updatedQuizSet = await QuizService.updateQuizSet(id, updates);
      setQuizSets(prev => prev.map(q => 
        q.id === id ? { ...updatedQuizSet, questionCount: q.questionCount, progress: q.progress } : q
      ));
      toast.success('Quiz set updated successfully');
    } catch (error) {
      handleError(error, 'update quiz set');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteQuizSet = async (id: string) => {
    try {
      setIsLoading(true);
      await QuizService.deleteQuizSet(id);
      setQuizSets(prev => prev.filter(q => q.id !== id));
      toast.success('Quiz set deleted successfully');
    } catch (error) {
      handleError(error, 'delete quiz set');
    } finally {
      setIsLoading(false);
    }
  };

  const createQuizQuestion = async (question: Database['public']['Tables']['quiz_questions']['Insert']) => {
    try {
      await QuizService.createQuizQuestion(question);
      // Refresh quiz sets to update question count
      await getQuizSets();
      toast.success('Question created successfully');
    } catch (error) {
      handleError(error, 'create question');
    }
  };

  const updateQuizQuestion = async (id: string, updates: Database['public']['Tables']['quiz_questions']['Update']) => {
    try {
      await QuizService.updateQuizQuestion(id, updates);
      toast.success('Question updated successfully');
    } catch (error) {
      handleError(error, 'update question');
    }
  };

  const deleteQuizQuestion = async (id: string) => {
    try {
      await QuizService.deleteQuizQuestion(id);
      // Refresh quiz sets to update question count
      await getQuizSets();
      toast.success('Question deleted successfully');
    } catch (error) {
      handleError(error, 'delete question');
    }
  };

  const submitQuizAnswers = async (
    quizSetId: string, 
    answers: { questionId: string; answer: string }[]
  ): Promise<{ score: number; totalQuestions: number; passed: boolean }> => {
    try {
      if (!currentUser) throw new Error('User not authenticated');
      
      const result = await QuizService.submitQuizAnswers(currentUser.id, quizSetId, answers);
      
      // Update local quiz progress
      setQuizSets(prev => prev.map(q => 
        q.id === quizSetId 
          ? { 
              ...q, 
              progress: {
                id: '', // We don't have the ID from the result
                user_id: currentUser.id,
                quiz_set_id: quizSetId,
                completed: result.passed,
                score: result.score,
                total_questions: result.totalQuestions,
                last_attempted_at: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            }
          : q
      ));

      toast.success(
        result.passed ? 'Quiz completed successfully!' : 'Quiz completed',
        {
          description: `Score: ${result.score}/${result.totalQuestions} (${Math.round((result.score / result.totalQuestions) * 100)}%)`
        }
      );

      return result;
    } catch (error) {
      handleError(error, 'submit quiz answers');
      throw error;
    }
  };

  return (
    <LearningContext.Provider
      value={{
        isLoading,
        tutorials,
        getTutorials,
        createTutorial,
        updateTutorial,
        deleteTutorial,
        updateTutorialProgress,
        materials,
        getMaterials,
        createMaterial,
        updateMaterial,
        deleteMaterial,
        quizSets,
        getQuizSets,
        getQuizSetWithQuestions,
        createQuizSet,
        updateQuizSet,
        deleteQuizSet,
        createQuizQuestion,
        updateQuizQuestion,
        deleteQuizQuestion,
        submitQuizAnswers
      }}
    >
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
};
