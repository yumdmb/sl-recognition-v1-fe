import { QuizQuestion, getQuizSets } from '@/data/contentData';
import QuizQuestionEditor from './QuizQuestionEditor';

export default function EditQuizQuestionsPage({ params }: { params: { setId: string } }) {
  const { setId } = params;
  
  // Get quiz set title
  const quizSets = getQuizSets();
  const quizSet = quizSets.find(set => set.id === setId);
  const quizTitle = quizSet?.title || '';
  
  return (
    <QuizQuestionEditor setId={setId} quizTitle={quizTitle} />
  );
} 