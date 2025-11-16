'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toast } from "sonner";
import { useAuth } from './AuthContext';
import { TutorialService } from '@/lib/services/tutorialService';
import * as MaterialService from '@/lib/services/materialService';
import { QuizService } from '@/lib/services/quizService';
import * as ProficiencyTestService from '@/lib/services/proficiencyTestService';
import { LearningRecommendation } from '@/lib/services/recommendationEngine';
import type { 
  TutorialWithProgress, 
  Material, 
  QuizSetWithProgress,
  QuizSetWithQuestions,
  Database 
} from '@/types/database';

interface LearningContextProps {
  // Loaders - separate loading states for each section
  isLoading: boolean; // Keep for backward compatibility
  tutorialsLoading: boolean;
  materialsLoading: boolean;
  quizSetsLoading: boolean;
  proficiencyTestLoading: boolean;
    // Tutorials
  tutorials: TutorialWithProgress[];
  getTutorials: (language?: 'ASL' | 'MSL') => Promise<void>;
  createTutorial: (tutorial: Database['public']['Tables']['tutorials']['Insert']) => Promise<void>;
  updateTutorial: (id: string, updates: Database['public']['Tables']['tutorials']['Update']) => Promise<void>;
  deleteTutorial: (id: string) => Promise<void>;
  startTutorial: (tutorialId: string) => Promise<void>;
  markTutorialDone: (tutorialId: string) => Promise<void>;
  getOverallProgress: () => Promise<{ totalStarted: number; totalCompleted: number; completionPercentage: number; }>;
  
  // Materials
  materials: Material[];
  getMaterials: (language?: 'ASL' | 'MSL') => Promise<void>;
  createMaterial: (material: Material, file?: File) => Promise<void>;
  updateMaterial: (id: string, updates: Partial<Omit<Material, 'id'>>, file?: File) => Promise<void>;
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
  
  // Proficiency Test State
  proficiencyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | null;
  currentTest: ProficiencyTestService.ProficiencyTest | null;
  testAttempt: Database['public']['Tables']['proficiency_test_attempts']['Row'] | null;
  learningPath: LearningRecommendation[];
  
  // Proficiency Test Methods
  startTest: (testId: string) => Promise<void>;
  submitAnswer: (questionId: string, choiceId: string) => Promise<void>;
  submitTest: () => Promise<{ 
    score: number; 
    proficiency_level: 'Beginner' | 'Intermediate' | 'Advanced';
    attemptId: string;
  }>;
  getTestResults: (attemptId: string) => Promise<any>;
  
  // Learning Path Methods
  generateLearningPath: () => Promise<void>;
  updateLearningPath: () => Promise<void>;
  getLearningRecommendations: () => Promise<LearningRecommendation[]>;
}

const LearningContext = createContext<LearningContextProps | null>(null);

export const LearningProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [tutorialsLoading, setTutorialsLoading] = useState(false);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [quizSetsLoading, setQuizSetsLoading] = useState(false);
  const [proficiencyTestLoading, setProficiencyTestLoading] = useState(false);
  const [tutorials, setTutorials] = useState<TutorialWithProgress[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [quizSets, setQuizSets] = useState<QuizSetWithProgress[]>([]);
  
  // Proficiency Test State
  const [proficiencyLevel, setProficiencyLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | null>(null);
  const [currentTest, setCurrentTest] = useState<ProficiencyTestService.ProficiencyTest | null>(null);
  const [testAttempt, setTestAttempt] = useState<Database['public']['Tables']['proficiency_test_attempts']['Row'] | null>(null);
  const [learningPath, setLearningPath] = useState<LearningRecommendation[]>([]);
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
  };  // Tutorials
  const getTutorials = useCallback(async (language?: 'ASL' | 'MSL') => {
    try {
      setTutorialsLoading(true);
      const data = await TutorialService.getTutorials(currentUser?.id, language);
      setTutorials(data);
    } catch (error) {
      handleError(error, 'fetch tutorials');
    } finally {
      setTutorialsLoading(false);
    }
  }, [currentUser?.id]);

  const createTutorial = async (tutorial: Database['public']['Tables']['tutorials']['Insert']) => {
    try {
      setTutorialsLoading(true);
      const newTutorial = await TutorialService.createTutorial({
        ...tutorial,
        created_by: currentUser?.id
      });
      setTutorials(prev => [{ ...newTutorial, status: 'not-started' }, ...prev]);
      toast.success('Tutorial created successfully');
    } catch (error) {
      handleError(error, 'create tutorial');
    } finally {
      setTutorialsLoading(false);
    }
  };

  const updateTutorial = async (id: string, updates: Database['public']['Tables']['tutorials']['Update']) => {
    try {
      setTutorialsLoading(true);
      const updatedTutorial = await TutorialService.updateTutorial(id, updates);      setTutorials(prev => prev.map(t => 
        t.id === id ? { ...updatedTutorial, status: t.status } : t
      ));
      toast.success('Tutorial updated successfully');
    } catch (error) {
      handleError(error, 'update tutorial');
    } finally {
      setTutorialsLoading(false);
    }
  };

  const deleteTutorial = async (id: string) => {
    try {
      setTutorialsLoading(true);
      await TutorialService.deleteTutorial(id);
      setTutorials(prev => prev.filter(t => t.id !== id));
      toast.success('Tutorial deleted successfully');
    } catch (error) {
      handleError(error, 'delete tutorial');    } finally {
      setTutorialsLoading(false);
    }
  };

  const startTutorial = async (tutorialId: string) => {
    try {
      if (!currentUser) return;
      await TutorialService.startTutorial(currentUser.id, tutorialId);
      setTutorials(prev => prev.map(t => 
        t.id === tutorialId ? { ...t, status: 'started' } : t
      ));
      toast.success('Tutorial started! Track your progress.');
    } catch (error) {
      handleError(error, 'start tutorial');
    }
  };

  const markTutorialDone = async (tutorialId: string) => {
    try {
      if (!currentUser) return;
      await TutorialService.markTutorialDone(currentUser.id, tutorialId);
      setTutorials(prev => prev.map(t => 
        t.id === tutorialId ? { ...t, status: 'completed' } : t
      ));
      toast.success('Tutorial marked as completed!');
    } catch (error) {
      handleError(error, 'mark tutorial as done');
    }
  };

  const getOverallProgress = async () => {
    if (!currentUser) return { totalStarted: 0, totalCompleted: 0, completionPercentage: 0 };
    return await TutorialService.getOverallProgress(currentUser.id);
  };  // Materials
  const getMaterials = useCallback(async (language: 'ASL' | 'MSL' = 'MSL') => {
    try {
      setMaterialsLoading(true);
      const data = await MaterialService.getMaterials(language);
      setMaterials(data);
    } catch (error) {
      handleError(error, 'fetch materials');
    } finally {
      setMaterialsLoading(false);
    }
  }, []);

  const createMaterial = async (material: Material, file?: File) => {
    try {
      setMaterialsLoading(true);
      let filePath: string | null = material.file_path || null;
      let downloadUrl: string = material.download_url || '';
      let fileSize: number | null = material.file_size || null;

      if (file) {
        const fileName = `${currentUser?.id || 'unknown_user'}/${Date.now()}_${file.name}`;
        filePath = await MaterialService.uploadMaterialFile(file, fileName);
        downloadUrl = MaterialService.getMaterialPublicUrl(filePath);
        fileSize = file.size;
      }

      // Exclude properties that should not be sent on create
      const { id, created_at, updated_at, ...insertData } = material;

      const newMaterialData = {
        ...insertData,
        created_by: currentUser?.id || null,
        file_path: filePath,
        download_url: downloadUrl,
        file_size: fileSize,
        type: file?.type || 'link',
      };

      const newMaterial = await MaterialService.createMaterial(newMaterialData);
      setMaterials(prev => [newMaterial, ...prev]);
      toast.success('Material created successfully');
    } catch (error) {
      handleError(error, 'create material');
    } finally {
      setMaterialsLoading(false);
    }
  };

  const updateMaterial = async (id: string, updates: Partial<Omit<Material, 'id'>>, file?: File) => {
    try {
      setMaterialsLoading(true);
      const finalUpdates = { ...updates };

      if (file) {
        const currentMaterial = materials.find(m => m.id === id);
        if (currentMaterial?.file_path) {
          await MaterialService.deleteMaterialFile(currentMaterial.file_path);
        }

        const fileName = `${currentUser?.id || 'unknown_user'}/${Date.now()}_${file.name}`;
        const newFilePath = await MaterialService.uploadMaterialFile(file, fileName);
        finalUpdates.file_path = newFilePath;
        finalUpdates.download_url = MaterialService.getMaterialPublicUrl(newFilePath);
        finalUpdates.file_size = file.size;
        finalUpdates.type = file.type;
      }

      const updatedMaterial = await MaterialService.updateMaterial(id, finalUpdates);
      setMaterials(prev => prev.map(m => (m.id === id ? updatedMaterial : m)));
      toast.success('Material updated successfully');
    } catch (error) {
      handleError(error, 'update material');
    } finally {
      setMaterialsLoading(false);
    }
  };

  const deleteMaterial = async (id: string) => {
    try {
      setMaterialsLoading(true);
      await MaterialService.deleteMaterial(id);
      setMaterials(prev => prev.filter(m => m.id !== id));
      toast.success('Material deleted successfully');
    } catch (error) {
      handleError(error, 'delete material');
    } finally {
      setMaterialsLoading(false);
    }
  };  // Quizzes
  const getQuizSets = useCallback(async (language?: 'ASL' | 'MSL') => {
    try {
      setQuizSetsLoading(true);
      const data = await QuizService.getQuizSets(currentUser?.id, language);
      setQuizSets(data);
    } catch (error) {
      handleError(error, 'fetch quiz sets');
    } finally {
      setQuizSetsLoading(false);
    }
  }, [currentUser?.id]);

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
      setQuizSetsLoading(true);
      const newQuizSet = await QuizService.createQuizSet({
        ...quizSet,
        created_by: currentUser?.id
      });
      setQuizSets(prev => [{ ...newQuizSet, questionCount: 0 }, ...prev]);
      toast.success('Quiz set created successfully');
    } catch (error) {
      handleError(error, 'create quiz set');
    } finally {
      setQuizSetsLoading(false);
    }
  };

  const updateQuizSet = async (id: string, updates: Database['public']['Tables']['quiz_sets']['Update']) => {
    try {
      setQuizSetsLoading(true);
      const updatedQuizSet = await QuizService.updateQuizSet(id, updates);
      setQuizSets(prev => prev.map(q => 
        q.id === id ? { ...updatedQuizSet, questionCount: q.questionCount, progress: q.progress } : q
      ));
      toast.success('Quiz set updated successfully');
    } catch (error) {
      handleError(error, 'update quiz set');
    } finally {
      setQuizSetsLoading(false);
    }
  };

  const deleteQuizSet = async (id: string) => {
    try {
      setQuizSetsLoading(true);
      await QuizService.deleteQuizSet(id);
      setQuizSets(prev => prev.filter(q => q.id !== id));
      toast.success('Quiz set deleted successfully');
    } catch (error) {
      handleError(error, 'delete quiz set');
    } finally {
      setQuizSetsLoading(false);
    }
  };
  const createQuizQuestion = async (question: Database['public']['Tables']['quiz_questions']['Insert']) => {
    try {
      await QuizService.createQuizQuestion(question);
      // Don't refresh quiz sets here - let the calling component handle it
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
      // Don't refresh quiz sets here - let the calling component handle it
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

  // Proficiency Test Methods
  const startTest = async (testId: string) => {
    try {
      if (!currentUser) throw new Error('User not authenticated');
      
      setProficiencyTestLoading(true);
      
      // Fetch the test with questions
      const test = await ProficiencyTestService.getProficiencyTest(testId);
      if (!test) throw new Error('Test not found');
      
      // Create a new test attempt
      const attempt = await ProficiencyTestService.createTestAttempt(currentUser.id, testId);
      
      setCurrentTest(test);
      setTestAttempt(attempt);
      
      toast.success('Test started! Good luck!');
    } catch (error) {
      handleError(error, 'start proficiency test');
      throw error;
    } finally {
      setProficiencyTestLoading(false);
    }
  };

  const submitAnswer = async (questionId: string, choiceId: string) => {
    try {
      if (!testAttempt) throw new Error('No active test attempt');
      
      await ProficiencyTestService.submitAnswer(testAttempt.id, questionId, choiceId);
    } catch (error) {
      handleError(error, 'submit answer');
      throw error;
    }
  };

  const submitTest = async (): Promise<{ 
    score: number; 
    proficiency_level: 'Beginner' | 'Intermediate' | 'Advanced';
    attemptId: string;
  }> => {
    try {
      if (!currentUser) throw new Error('User not authenticated');
      if (!testAttempt) throw new Error('No active test attempt');
      
      setProficiencyTestLoading(true);
      
      const attemptId = testAttempt.id;
      
      // Calculate results and assign proficiency level
      const result = await ProficiencyTestService.calculateResultAndAssignProficiency(
        attemptId,
        currentUser.id
      );
      
      // Update local state
      setProficiencyLevel(result.proficiency_level);
      
      // Generate learning path automatically
      await generateLearningPath();
      
      toast.success('Test completed successfully!', {
        description: `Your proficiency level: ${result.proficiency_level}`
      });
      
      return {
        ...result,
        attemptId
      };
    } catch (error) {
      handleError(error, 'submit proficiency test');
      throw error;
    } finally {
      setProficiencyTestLoading(false);
    }
  };

  const getTestResults = async (attemptId: string) => {
    try {
      if (!currentUser) throw new Error('User not authenticated');
      
      setProficiencyTestLoading(true);
      
      const results = await ProficiencyTestService.getTestResultsWithAnalysis(
        attemptId,
        currentUser.id
      );
      
      // Update local state with proficiency level
      setProficiencyLevel(results.proficiencyLevel);
      
      return results;
    } catch (error) {
      handleError(error, 'fetch test results');
      throw error;
    } finally {
      setProficiencyTestLoading(false);
    }
  };

  // Learning Path Methods
  const generateLearningPath = async () => {
    try {
      if (!currentUser) throw new Error('User not authenticated');
      
      setProficiencyTestLoading(true);
      
      // Create Supabase client
      const { createBrowserClient } = await import('@supabase/ssr');
      const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      
      // Get the latest test results with recommendations
      const { data: latestAttempt, error } = await supabase
        .from('proficiency_test_attempts')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error || !latestAttempt) {
        console.warn('No test attempt found for learning path generation');
        setLearningPath([]);
        return;
      }
      
      // Get recommendations using the test results
      const results = await ProficiencyTestService.getTestResultsWithAnalysis(
        latestAttempt.id,
        currentUser.id
      );
      
      setLearningPath(results.recommendations);
      setProficiencyLevel(results.proficiencyLevel);
      
    } catch (error) {
      handleError(error, 'generate learning path');
    } finally {
      setProficiencyTestLoading(false);
    }
  };

  const updateLearningPath = async () => {
    try {
      if (!currentUser) throw new Error('User not authenticated');
      
      setProficiencyTestLoading(true);
      
      // Regenerate learning path based on current progress
      await generateLearningPath();
      
      toast.success('Learning path updated based on your progress');
    } catch (error) {
      handleError(error, 'update learning path');
    } finally {
      setProficiencyTestLoading(false);
    }
  };

  const getLearningRecommendations = async (): Promise<LearningRecommendation[]> => {
    try {
      if (!currentUser) throw new Error('User not authenticated');
      
      // If we already have recommendations in state, return them
      if (learningPath.length > 0) {
        return learningPath;
      }
      
      // Otherwise, generate new recommendations
      await generateLearningPath();
      return learningPath;
    } catch (error) {
      handleError(error, 'fetch learning recommendations');
      return [];
    }
  };

  return (
    <LearningContext.Provider
      value={{
        isLoading: tutorialsLoading || materialsLoading || quizSetsLoading || proficiencyTestLoading, // Computed from individual states
        tutorialsLoading,
        materialsLoading,
        quizSetsLoading,
        proficiencyTestLoading,
        tutorials,
        getTutorials,
        createTutorial,
        updateTutorial,
        deleteTutorial,
        startTutorial,
        markTutorialDone,
        getOverallProgress,
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
        submitQuizAnswers,
        // Proficiency Test State
        proficiencyLevel,
        currentTest,
        testAttempt,
        learningPath,
        // Proficiency Test Methods
        startTest,
        submitAnswer,
        submitTest,
        getTestResults,
        // Learning Path Methods
        generateLearningPath,
        updateLearningPath,
        getLearningRecommendations
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
