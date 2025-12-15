import React from 'react';
import { Database } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type Question = Database['public']['Tables']['proficiency_test_questions']['Row'] & {
  choices: Database['public']['Tables']['proficiency_test_question_choices']['Row'][];
};

interface ProficiencyTestQuestionProps {
  question: Question;
  onSelectChoice: (choiceId: string) => void;
  selectedChoice: string | null;
}

const ProficiencyTestQuestion: React.FC<ProficiencyTestQuestionProps> = ({ question, onSelectChoice, selectedChoice }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{question.question_text}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup onValueChange={onSelectChoice} value={selectedChoice || undefined}>
          <div className="space-y-3 md:space-y-2">
            {question.choices.map((choice) => (
              <div key={choice.id} className="flex items-center space-x-3 min-h-[44px] p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value={choice.id} id={choice.id} className="min-h-[24px] min-w-[24px]" />
                <Label htmlFor={choice.id} className="cursor-pointer flex-1 text-base">{choice.choice_text}</Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default ProficiencyTestQuestion;