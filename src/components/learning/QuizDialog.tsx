'use client'

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{quizSet.id ? 'Edit' : 'Add'} Quiz Set</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="title" className="sm:text-right">Title</Label>
            <Input
              id="title"
              value={quizSet.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="sm:col-span-3"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="description" className="sm:text-right">Description</Label>
            <Textarea
              id="description"
              value={quizSet.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              className="sm:col-span-3"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="language" className="sm:text-right">Language</Label>
            <Select value={quizSet.language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="sm:col-span-3">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASL">ASL</SelectItem>
                <SelectItem value="MSL">MSL</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="level" className="sm:text-right">Level</Label>
            <Select value={quizSet.level || 'beginner'} onValueChange={(value) => handleFieldChange('level', value)}>
              <SelectTrigger className="sm:col-span-3">
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
