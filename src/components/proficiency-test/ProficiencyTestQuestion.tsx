import React from 'react';
import { Database } from '@/types/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

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
        {question.image_url && (
          <div className="mt-4 flex justify-center">
            <div className="relative max-w-md w-full aspect-video rounded-lg overflow-hidden bg-muted">
              <Image
                src={question.image_url}
                alt="Question image"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <RadioGroup onValueChange={onSelectChoice} value={selectedChoice || undefined}>
          <div className="space-y-3 md:space-y-2">
            {question.choices.map((choice) => (
              <div key={choice.id} className="flex items-start space-x-3 min-h-[44px] p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                <RadioGroupItem value={choice.id} id={choice.id} className="min-h-[24px] min-w-[24px] mt-0.5" />
                <Label htmlFor={choice.id} className="cursor-pointer flex-1">
                  <span className="text-base">{choice.choice_text}</span>
                  {choice.image_url && (
                    <div className="mt-2 relative max-w-xs w-full aspect-video rounded-md overflow-hidden bg-muted">
                      <Image
                        src={choice.image_url}
                        alt="Choice image"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  )}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default ProficiencyTestQuestion;