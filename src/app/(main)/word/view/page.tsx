'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { WordSubmission } from '../submit/page';
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Toaster } from "@/components/ui/sonner";

const getWordSubmissions = (): WordSubmission[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('wordSubmissions');
    return stored ? JSON.parse(stored) : [];
  }
  return [];
};

export default function WordView() {
  const [submissions, setSubmissions] = useState<WordSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Load submissions from local storage
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <div className="container py-6">
      <Toaster />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {currentUser?.role === 'admin' ? 'All Word Submissions' : 'My Word Submissions'}
        </h1>
        <Button asChild>
          <Link href="/word/submit">Submit New Word</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-signlang-primary border-r-transparent"></div>
          <p className="mt-4 text-gray-500">Loading submissions...</p>
        </div>
      ) : submissions.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Word</TableHead>
                  <TableHead>Language</TableHead>
                  <TableHead>Submitted By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Media</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell className="font-medium">{submission.word}</TableCell>
                    <TableCell>{submission.language}</TableCell>
                    <TableCell>{submission.submittedBy.name}</TableCell>
                    <TableCell>
                      {getStatusBadge(submission.status)}
                    </TableCell>
                    <TableCell>
                      {submission.mediaType === 'image' ? (
                        <img 
                          src={submission.mediaUrl} 
                          alt={`Sign language gesture for ${submission.word}`}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <video 
                          src={submission.mediaUrl}
                          className="w-16 h-16 object-cover rounded"
                          controls
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {currentUser?.role === 'admin' && submission.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(submission.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(submission.id)}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {currentUser?.role === 'admin' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(submission.id)}
                          className="mt-2"
                        >
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Submissions Found</CardTitle>
            <CardDescription>
              {currentUser?.role === 'admin' 
                ? "There are no word submissions to review at this time."
                : "You haven't submitted any sign language words yet."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild>
              <Link href="/word/submit">Submit Your First Word</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 