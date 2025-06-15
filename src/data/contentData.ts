// Types for content data
export interface Tutorial {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  progress?: number;
  language: 'ASL' | 'MSL';
}

export interface Material {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'document';
  fileSize?: string;
  downloadUrl: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: 'ASL' | 'MSL';
}

export interface QuizSet {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  language: 'ASL' | 'MSL';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  videoUrl?: string; // For sign language questions
  imageUrl?: string;
}

export interface QuizData {
  [key: string]: QuizQuestion[];
}

// Progress tracking interfaces
export interface TutorialProgress {
  tutorialId: string;
  progress: number; // 0-100
  lastUpdated: string;
}

export interface QuizProgress {
  quizId: string;
  completed: boolean;
  score: number;
  totalQuestions: number;
  lastAttempted: string;
}

export interface UserProgress {
  userId: string;
  tutorials: TutorialProgress[];
  quizzes: QuizProgress[];
}

// Initial data - now empty for clean start
const initialTutorials: Tutorial[] = [];

const initialMaterials: Material[] = [];

const initialQuizSets: QuizSet[] = [];

const initialQuizData: QuizData = {};

// Data management functions using localStorage

// Helper to get data from localStorage or return initial data if not found
const getFromStorage = <T>(key: string, initialData: T): T => {
  if (typeof window === 'undefined') return initialData;
  
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : initialData;
};

// Helper to save data to localStorage
const saveToStorage = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

// Tutorials functions
export const getTutorials = (): Tutorial[] => {
  return getFromStorage('tutorials', initialTutorials);
};

export const saveTutorial = (tutorial: Tutorial): Tutorial[] => {
  const tutorials = getTutorials();
  
  // Check if tutorial exists (update) or is new (add)
  const index = tutorials.findIndex(t => t.id === tutorial.id);
  
  if (index >= 0) {
    // Update existing tutorial
    tutorials[index] = tutorial;
  } else {
    // Add new tutorial with unique ID if none provided
    if (!tutorial.id) {
      tutorial.id = Date.now().toString();
    }
    tutorials.push(tutorial);
  }
  
  saveToStorage('tutorials', tutorials);
  return tutorials;
};

export const deleteTutorial = (id: string): Tutorial[] => {
  const tutorials = getTutorials().filter(t => t.id !== id);
  saveToStorage('tutorials', tutorials);
  return tutorials;
};

// Materials functions
export const getMaterials = (): Material[] => {
  return getFromStorage('materials', initialMaterials);
};

export const saveMaterial = (material: Material): Material[] => {
  const materials = getMaterials();
  
  const index = materials.findIndex(m => m.id === material.id);
  
  if (index >= 0) {
    materials[index] = material;
  } else {
    if (!material.id) {
      material.id = Date.now().toString();
    }
    materials.push(material);
  }
  
  saveToStorage('materials', materials);
  return materials;
};

export const deleteMaterial = (id: string): Material[] => {
  const materials = getMaterials().filter(m => m.id !== id);
  saveToStorage('materials', materials);
  return materials;
};

// Quiz functions
export const getQuizSets = (): QuizSet[] => {
  return getFromStorage('quizSets', initialQuizSets);
};

export const saveQuizSet = (quizSet: QuizSet): QuizSet[] => {
  const quizSets = getQuizSets();
  
  const index = quizSets.findIndex(q => q.id === quizSet.id);
  
  if (index >= 0) {
    quizSets[index] = quizSet;
  } else {
    if (!quizSet.id) {
      quizSet.id = `${quizSet.language.toLowerCase()}-${Date.now()}`;
    }
    quizSets.push(quizSet);
  }
  
  saveToStorage('quizSets', quizSets);
  return quizSets;
};

export const deleteQuizSet = (id: string): QuizSet[] => {
  const quizSets = getQuizSets().filter(q => q.id !== id);
  saveToStorage('quizSets', quizSets);
  
  // Also delete associated questions
  const quizData = getQuizData();
  delete quizData[id];
  saveToStorage('quizData', quizData);
  
  return quizSets;
};

// Quiz Questions functions
export const getQuizData = (): QuizData => {
  return getFromStorage('quizData', initialQuizData);
};

export const getQuizQuestions = (setId: string): QuizQuestion[] => {
  const quizData = getQuizData();
  return quizData[setId] || [];
};

export const saveQuizQuestion = (setId: string, question: QuizQuestion): QuizQuestion[] => {
  const quizData = getQuizData();
  
  // Initialize the set if it doesn't exist
  if (!quizData[setId]) {
    quizData[setId] = [];
  }
  
  const questions = quizData[setId];
  const index = questions.findIndex(q => q.id === question.id);
  
  if (index >= 0) {
    questions[index] = question;
  } else {
    if (!question.id) {
      question.id = `q${Date.now()}`;
    }
    questions.push(question);
  }
  
  // Update question count in quiz set
  const quizSets = getQuizSets();
  const quizSetIndex = quizSets.findIndex(q => q.id === setId);
  if (quizSetIndex >= 0) {
    quizSets[quizSetIndex].questionCount = questions.length;
    saveToStorage('quizSets', quizSets);
  }
  
  quizData[setId] = questions;
  saveToStorage('quizData', quizData);
  return questions;
};

export const deleteQuizQuestion = (setId: string, questionId: string): QuizQuestion[] => {
  const quizData = getQuizData();
  
  if (!quizData[setId]) return [];
  
  quizData[setId] = quizData[setId].filter(q => q.id !== questionId);
  
  // Update question count in quiz set
  const quizSets = getQuizSets();
  const quizSetIndex = quizSets.findIndex(q => q.id === setId);
  if (quizSetIndex >= 0) {
    quizSets[quizSetIndex].questionCount = quizData[setId].length;
    saveToStorage('quizSets', quizSets);
  }
  
  saveToStorage('quizData', quizData);
  return quizData[setId];
};

// User progress functions
export const getUserProgress = (userId: string): UserProgress => {
  const defaultProgress: UserProgress = {
    userId,
    tutorials: [],
    quizzes: []
  };
  
  return getFromStorage(`user_progress_${userId}`, defaultProgress);
};

export const updateTutorialProgress = (userId: string, tutorialId: string, progress: number): UserProgress => {
  const userProgress = getUserProgress(userId);
  
  const tutorialIndex = userProgress.tutorials.findIndex(t => t.tutorialId === tutorialId);
  
  if (tutorialIndex >= 0) {
    userProgress.tutorials[tutorialIndex] = {
      tutorialId,
      progress,
      lastUpdated: new Date().toISOString()
    };
  } else {
    userProgress.tutorials.push({
      tutorialId,
      progress,
      lastUpdated: new Date().toISOString()
    });
  }
  
  saveToStorage(`user_progress_${userId}`, userProgress);
  return userProgress;
};

export const updateQuizProgress = (
  userId: string, 
  quizId: string, 
  score: number, 
  totalQuestions: number
): UserProgress => {
  const userProgress = getUserProgress(userId);
  
  const quizIndex = userProgress.quizzes.findIndex(q => q.quizId === quizId);
  
  if (quizIndex >= 0) {
    userProgress.quizzes[quizIndex] = {
      quizId,
      completed: true,
      score,
      totalQuestions,
      lastAttempted: new Date().toISOString()
    };
  } else {
    userProgress.quizzes.push({
      quizId,
      completed: true,
      score,
      totalQuestions,
      lastAttempted: new Date().toISOString()
    });
  }
  
  saveToStorage(`user_progress_${userId}`, userProgress);
  return userProgress;
};

export const getOverallTutorialProgress = (userId: string, language?: 'ASL' | 'MSL'): number => {
  const userProgress = getUserProgress(userId);
  const tutorials = getTutorials();
  
  // Filter tutorials by language if provided
  const filteredTutorials = language 
    ? tutorials.filter(t => t.language === language)
    : tutorials;
  
  // If no tutorials or progress, return 0
  if (filteredTutorials.length === 0 || userProgress.tutorials.length === 0) {
    return 0;
  }
  
  // Map tutorial IDs for easier lookup
  const tutorialProgressMap = new Map<string, number>();
  userProgress.tutorials.forEach(t => tutorialProgressMap.set(t.tutorialId, t.progress));
  
  // Calculate overall progress
  let totalProgress = 0;
  filteredTutorials.forEach(tutorial => {
    totalProgress += tutorialProgressMap.get(tutorial.id) || 0;
  });
  
  return Math.round(totalProgress / filteredTutorials.length);
};

export const getOverallQuizProgress = (userId: string, language?: 'ASL' | 'MSL'): { 
  completion: number, 
  score: number 
} => {
  const userProgress = getUserProgress(userId);
  const quizSets = getQuizSets();
  
  // Filter quiz sets by language if provided
  const filteredQuizSets = language 
    ? quizSets.filter(q => q.language === language)
    : quizSets;
  
  // If no quizzes or progress, return 0
  if (filteredQuizSets.length === 0) {
    return { completion: 0, score: 0 };
  }
  
  // Map quiz IDs for easier lookup
  const quizProgressMap = new Map<string, QuizProgress>();
  userProgress.quizzes.forEach(q => quizProgressMap.set(q.quizId, q));
  
  // Calculate overall progress
  let completedQuizzes = 0;
  let totalScore = 0;
  let totalPossibleScore = 0;
  
  filteredQuizSets.forEach(quizSet => {
    const progress = quizProgressMap.get(quizSet.id);
    if (progress && progress.completed) {
      completedQuizzes++;
      totalScore += progress.score;
      totalPossibleScore += progress.totalQuestions;
    }
  });
  
  const completion = filteredQuizSets.length > 0 
    ? Math.round((completedQuizzes / filteredQuizSets.length) * 100)
    : 0;
    
  const score = totalPossibleScore > 0 
    ? Math.round((totalScore / totalPossibleScore) * 100)
    : 0;
  
  return { completion, score };
};

// Initialize data in localStorage on first load
if (typeof window !== 'undefined') {
  if (!localStorage.getItem('tutorials')) {
    saveToStorage('tutorials', initialTutorials);
  }
  
  if (!localStorage.getItem('materials')) {
    saveToStorage('materials', initialMaterials);
  }
  
  if (!localStorage.getItem('quizSets')) {
    saveToStorage('quizSets', initialQuizSets);
  }
  
  if (!localStorage.getItem('quizData')) {
    saveToStorage('quizData', initialQuizData);
  }
} 