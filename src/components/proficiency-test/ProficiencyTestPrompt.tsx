'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Welcome!</AlertDialogTitle>
          <AlertDialogDescription>
            Would you like to take a quick test to assess your sign language proficiency? This will help us personalize your learning experience.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Maybe Later</AlertDialogCancel>
          <AlertDialogAction onClick={handleTakeTest}>Take Test</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProficiencyTestPrompt;