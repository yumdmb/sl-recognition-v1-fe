'use client'

import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { useAuth } from '@/context/AuthContext';
import { WordSubmission } from './useWordSubmission';

const getWordSubmissions = (): WordSubmission[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('wordSubmissions');
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

export function useWordSubmissionsView() {
  const [submissions, setSubmissions] = useState<WordSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const loadSubmissions = () => {
      const allSubmissions = getWordSubmissions();
      
      // If admin, show all submissions
      // If regular user, only show their own submissions
      const filteredSubmissions = currentUser?.role === 'admin' 
        ? allSubmissions 
        : allSubmissions.filter((sub: WordSubmission) => sub.submittedBy.id === currentUser?.id);
      
      setSubmissions(filteredSubmissions);
      setIsLoading(false);
    };
    
    loadSubmissions();
  }, [currentUser]);

  const handleApprove = (submissionId: string) => {
    // Update submission status in local storage
    const allSubmissions = getWordSubmissions();
    const updatedSubmissions = allSubmissions.map((sub: WordSubmission) =>
      sub.id === submissionId ? { ...sub, status: 'approved', reviewedAt: new Date().toISOString() } : sub
    );
    
    localStorage.setItem('wordSubmissions', JSON.stringify(updatedSubmissions));
    
    // Update state
    setSubmissions(prevSubmissions =>
      prevSubmissions.map(sub =>
        sub.id === submissionId ? { ...sub, status: 'approved', reviewedAt: new Date().toISOString() } : sub
      )
    );

    toast.success("Word Approved", {
      description: "The word has been approved and published."
    });
  };

  const handleReject = (submissionId: string) => {
    // Update submission status in local storage
    const allSubmissions = getWordSubmissions();
    const updatedSubmissions = allSubmissions.map((sub: WordSubmission) =>
      sub.id === submissionId ? { ...sub, status: 'rejected', reviewedAt: new Date().toISOString() } : sub
    );
    
    localStorage.setItem('wordSubmissions', JSON.stringify(updatedSubmissions));
    
    // Update state
    setSubmissions(prevSubmissions =>
      prevSubmissions.map(sub =>
        sub.id === submissionId ? { ...sub, status: 'rejected', reviewedAt: new Date().toISOString() } : sub
      )
    );

    toast.error("Word Rejected", {
      description: "The word has been rejected."
    });
  };

  const handleDelete = (submissionId: string) => {
    // Get all submissions from local storage
    const allSubmissions = getWordSubmissions();
    // Filter out the submission to be deleted
    const updatedSubmissions = allSubmissions.filter((sub: WordSubmission) => sub.id !== submissionId);
    
    // Update local storage
    localStorage.setItem('wordSubmissions', JSON.stringify(updatedSubmissions));
    
    // Update state
    setSubmissions(prevSubmissions =>
      prevSubmissions.filter(sub => sub.id !== submissionId)
    );

    toast.error("Word Deleted", {
      description: "The word submission has been permanently deleted."
    });
  };

  return {
    submissions,
    isLoading,
    userRole: currentUser?.role,
    handleApprove,
    handleReject,
    handleDelete
  };
}
