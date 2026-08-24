'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { QuizSetWithProgress } from '@/types/database';

interface QuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizSet: QuizSetWithProgress | null;
  onQuizSetChange: (quizSet: QuizSetWithProgress) => void;
  onSave: (quizSet: QuizSetWithProgress) => void;
}

const QuizDialog: React.FC<QuizDialogProps> = ({
  open,
  onOpenChange,
  quizSet,
  onQuizSetChange,
  onSave
}) => {
  if (!quizSet) return null;

  const handleFieldChange = (field: string, value: string | number) => {
    onQuizSetChange({
      ...quizSet,
      [field]: value
    });
  };

  const handleLanguageChange = (value: string) => {
    onQuizSetChange({
      ...quizSet,
      language: value as 'ASL' | 'MSL'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-display">{quizSet.id ? 'Edit' : 'New'} quiz set</DialogTitle>
          <DialogDescription>
            Give the set a clear title and description so learners know what to expect.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Everyday greetings"
              value={quizSet.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What does this quiz cover?"
              value={quizSet.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select value={quizSet.language} onValueChange={handleLanguageChange}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASL">ASL — American Sign Language</SelectItem>
                <SelectItem value="MSL">MSL — Malaysian Sign Language</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Select value={quizSet.level || 'beginner'} onValueChange={(value) => handleFieldChange('level', value)}>
              <SelectTrigger id="level">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">Cancel</Button>
          <Button onClick={() => onSave(quizSet)} className="w-full sm:w-auto">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuizDialog;
