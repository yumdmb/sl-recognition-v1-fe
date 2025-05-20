// Types for content data
export interface Tutorial {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
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

// Initial data
const initialTutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Introduction to ASL',
    description: 'Learn the basics of American Sign Language and common gestures',
    thumbnailUrl: 'https://placehold.co/400x225?text=Introduction+Tutorial',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '12:30',
    level: 'beginner',
    progress: 100,
    language: 'ASL'
  },
  {
    id: '2',
    title: 'Everyday Conversation in ASL',
    description: 'Common signs for everyday conversations and interactions in American Sign Language',
    thumbnailUrl: 'https://placehold.co/400x225?text=Conversation+Tutorial',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '15:45',
    level: 'beginner',
    progress: 60,
    language: 'ASL'
  },
  {
    id: '3',
    title: 'Advanced ASL Expressions',
    description: 'Learn how to express complex emotions and feelings in American Sign Language',
    thumbnailUrl: 'https://placehold.co/400x225?text=Advanced+Tutorial',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '20:15',
    level: 'intermediate',
    progress: 0,
    language: 'ASL'
  },
  {
    id: '4',
    title: 'Professional ASL Communication',
    description: 'ASL for professional and workplace settings',
    thumbnailUrl: 'https://placehold.co/400x225?text=Professional+Tutorial',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '18:20',
    level: 'advanced',
    progress: 0,
    language: 'ASL'
  },
  {
    id: '5',
    title: 'Introduction to MSL',
    description: 'Learn the basics of Malaysian Sign Language and common gestures',
    thumbnailUrl: 'https://placehold.co/400x225?text=MSL+Introduction',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '14:20',
    level: 'beginner',
    progress: 0,
    language: 'MSL'
  },
  {
    id: '6',
    title: 'Everyday Conversation in MSL',
    description: 'Common signs for everyday conversations in Malaysian Sign Language',
    thumbnailUrl: 'https://placehold.co/400x225?text=MSL+Conversation',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '16:45',
    level: 'beginner',
    progress: 0,
    language: 'MSL'
  },
  {
    id: '7',
    title: 'Advanced MSL Expressions',
    description: 'Complex emotions and expressions in Malaysian Sign Language',
    thumbnailUrl: 'https://placehold.co/400x225?text=Advanced+MSL',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '19:30',
    level: 'intermediate',
    progress: 0,
    language: 'MSL'
  }
];

const initialMaterials: Material[] = [
  {
    id: '1',
    title: 'ASL Basics - Handbook',
    description: 'A comprehensive guide to basic American Sign Language gestures',
    type: 'pdf',
    fileSize: '2.4 MB',
    downloadUrl: '#',
    level: 'beginner',
    language: 'ASL'
  },
  {
    id: '2',
    title: 'ASL Everyday Phrases Practice Sheet',
    description: 'Practice sheets for common everyday ASL phrases',
    type: 'document',
    fileSize: '1.8 MB',
    downloadUrl: '#',
    level: 'beginner',
    language: 'ASL'
  },
  {
    id: '3',
    title: 'ASL Intermediate Conversations - Video Package',
    description: 'Video tutorials showcasing intermediate ASL conversation techniques',
    type: 'video',
    fileSize: '45.6 MB',
    downloadUrl: '#',
    level: 'intermediate',
    language: 'ASL'
  },
  {
    id: '4',
    title: 'Advanced ASL Expressions Handbook',
    description: 'Advanced techniques for expressing complex emotions and concepts in ASL',
    type: 'pdf',
    fileSize: '3.2 MB',
    downloadUrl: '#',
    level: 'advanced',
    language: 'ASL'
  },
  {
    id: '5',
    title: 'MSL Basics - Handbook',
    description: 'A comprehensive guide to basic Malaysian Sign Language gestures',
    type: 'pdf',
    fileSize: '2.8 MB',
    downloadUrl: '#',
    level: 'beginner',
    language: 'MSL'
  },
  {
    id: '6',
    title: 'MSL Everyday Phrases Practice Sheet',
    description: 'Practice sheets for common everyday Malaysian Sign Language phrases',
    type: 'document',
    fileSize: '1.5 MB',
    downloadUrl: '#',
    level: 'beginner',
    language: 'MSL'
  },
  {
    id: '7',
    title: 'MSL Intermediate Conversations - Video',
    description: 'Video tutorials for intermediate Malaysian Sign Language conversations',
    type: 'video',
    fileSize: '38.2 MB',
    downloadUrl: '#',
    level: 'intermediate',
    language: 'MSL'
  }
];

const initialQuizSets: QuizSet[] = [
  {
    id: "asl-basic",
    title: "ASL Basic Signs",
    description: "Quiz on common everyday ASL signs.",
    questionCount: 4,
    language: "ASL"
  },
  {
    id: "asl-intermediate",
    title: "ASL Intermediate Signs",
    description: "Quiz on more complex ASL signs.",
    questionCount: 3,
    language: "ASL"
  },
  {
    id: "asl-advanced",
    title: "ASL Advanced Signs",
    description: "Quiz for advanced ASL signers.",
    questionCount: 2,
    language: "ASL"
  },
  {
    id: "msl-basic",
    title: "MSL Basic Signs",
    description: "Quiz on common everyday MSL signs.",
    questionCount: 5,
    language: "MSL"
  },
  {
    id: "msl-intermediate",
    title: "MSL Intermediate Signs",
    description: "Quiz on more complex MSL signs.",
    questionCount: 4,
    language: "MSL"
  }
];

const initialQuizData: QuizData = {
  "asl-basic": [
    {
      id: "q1",
      question: "What does this sign mean?",
      options: ["Hello", "Goodbye", "Thank you", "Please"],
      correctAnswer: "Hello",
      explanation: "This is the common ASL sign for 'Hello' - a flat hand raised near your forehead in a salute-like motion.",
      videoUrl: "https://example.com/video1.mp4"
    },
    {
      id: "q2",
      question: "Which sign represents 'Thank you'?",
      options: ["Touching lips and moving hand forward", "Waving hand", "Thumbs up", "Hand over heart"],
      correctAnswer: "Touching lips and moving hand forward",
      explanation: "In ASL, 'Thank you' is signed by touching your lips with your fingertips and then moving your hand forward."
    }
  ],
  "asl-intermediate": [
    {
      id: "q1",
      question: "What does this sign mean in ASL?",
      options: ["Tomorrow", "Yesterday", "Next week", "Last month"],
      correctAnswer: "Tomorrow",
      explanation: "This sign shows the concept of 'forward time' which represents tomorrow.",
      videoUrl: "https://example.com/video3.mp4"
    }
  ]
};

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