'use client';

import React from 'react';
import { Database } from '@/types/database';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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
    <div>
      <p className="font-display text-xl font-bold leading-snug tracking-tight">
        {question.question_text}
      </p>
      {question.image_url && (
        <div className="mt-4 flex justify-center">
          <div className="relative max-w-md w-full aspect-video overflow-hidden rounded-xl border bg-muted">
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

      <RadioGroup
        onValueChange={onSelectChoice}
        value={selectedChoice || undefined}
        className="mt-5 space-y-3"
      >
        {question.choices.map((choice, i) => {
          const isSelected = selectedChoice === choice.id;

          return (
            <Label
              key={choice.id}
              htmlFor={choice.id}
              className={cn(
                'flex w-full cursor-pointer items-center gap-4 rounded-xl border p-4 text-sm font-normal transition-all',
                isSelected
                  ? 'border-primary bg-primary-soft shadow-soft'
                  : 'border-border hover:border-primary/40 hover:bg-accent'
              )}
            >
              <span
                className={cn(
                  'grid size-7 shrink-0 place-items-center rounded-full border text-xs font-bold transition-colors',
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground'
                )}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 leading-relaxed text-foreground">{choice.choice_text}</span>
              {choice.image_url && (
                <span className="relative block h-16 w-24 shrink-0 overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src={choice.image_url}
                    alt="Choice image"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </span>
              )}
              <RadioGroupItem value={choice.id} id={choice.id} className="sr-only" />
            </Label>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default ProficiencyTestQuestion;
