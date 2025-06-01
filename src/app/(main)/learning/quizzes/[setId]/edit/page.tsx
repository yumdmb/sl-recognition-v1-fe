'use client'

import { QuizQuestion, getQuizSets } from '@/data/contentData';
import QuizQuestionEditor from './QuizQuestionEditor';
import { useEffect, useState, use } from 'react';

export default function EditQuizQuestionsPage({ params }: { params: Promise<{ setId: string }> }) {
  const resolvedParams = use(params);
  const { setId } = resolvedParams;
  const [quizTitle, setQuizTitle] = useState('');
  
  useEffect(() => {
    // Get quiz set title from localStorage
    const quizSets = getQuizSets();
    const quizSet = quizSets.find(set => set.id === setId);
    setQuizTitle(quizSet?.title || '');
  }, [setId]);
  
  return (
    <QuizQuestionEditor setId={setId} quizTitle={quizTitle} />
  );
}