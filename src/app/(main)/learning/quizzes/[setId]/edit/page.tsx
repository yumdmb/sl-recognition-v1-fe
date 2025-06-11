'use client'

import { useParams } from 'next/navigation';
import { useLearning } from '@/context/LearningContext';
import QuizQuestionEditor from './QuizQuestionEditor';
import { useEffect, useState } from 'react';

export default function EditQuizQuestionsPage() {
  const params = useParams();
  const setId = params?.setId as string;
  const [quizTitle, setQuizTitle] = useState('');
  const { getQuizSetWithQuestions } = useLearning();
  
  useEffect(() => {
    // Get quiz set title from Supabase
    async function fetchQuizSet() {
      try {
        const quizSet = await getQuizSetWithQuestions(setId);
        setQuizTitle(quizSet?.title || '');
      } catch (error) {
        console.error('Error fetching quiz set:', error);
      }
    }
    
    fetchQuizSet();
  }, [setId, getQuizSetWithQuestions]);
  
  return (
    <QuizQuestionEditor setId={setId} quizTitle={quizTitle} />
  );
}