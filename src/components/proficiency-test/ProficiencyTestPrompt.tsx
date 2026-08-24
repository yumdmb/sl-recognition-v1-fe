'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface ProficiencyTestPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProficiencyTestPrompt: React.FC<ProficiencyTestPromptProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  const handleTakeTest = () => {
    router.push('/proficiency-test/select');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader className="sm:text-left">
          <div className="mb-2 flex justify-start">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary-soft text-primary">
              <Sparkles className="size-6" />
            </span>
          </div>
          <DialogTitle className="font-display text-xl font-extrabold tracking-tight">
            Find your sign language level!
          </DialogTitle>
          <DialogDescription className="leading-relaxed">
            Would you like to take a quick test to assess your sign language proficiency? This will
            help us personalize your learning experience.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-end">
          <Button variant="ghost" onClick={onClose}>
            Maybe Later
          </Button>
          <Button onClick={handleTakeTest}>Take Test</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProficiencyTestPrompt;
