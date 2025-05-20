'use client'

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useLanguage } from '@/context/LanguageContext';
import { useAdmin } from '@/context/AdminContext';
import { QuizSet, getQuizSets, saveQuizSet, deleteQuizSet } from '@/data/contentData';
import { Plus, Edit, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';

// Example quiz sets with language property
const quizSets = [
    {
        id: "asl-basic",
        title: "ASL Basic Signs",
        description: "Quiz on common everyday ASL signs.",
        questionCount: 4,
        language: "ASL"
    },
    {
        id: "asl-intermediate",
        title: "ASL Intermediate Signs",
        description: "Quiz on more complex ASL signs.",
        questionCount: 3,
        language: "ASL"
    },
    {
        id: "asl-advanced",
        title: "ASL Advanced Signs",
        description: "Quiz for advanced ASL signers.",
        questionCount: 2,
        language: "ASL"
    },
    {
        id: "msl-basic",
        title: "MSL Basic Signs",
        description: "Quiz on common everyday MSL signs.",
        questionCount: 5,
        language: "MSL"
    },
    {
        id: "msl-intermediate",
        title: "MSL Intermediate Signs",
        description: "Quiz on more complex MSL signs.",
        questionCount: 4,
        language: "MSL"
    }
];

export default function QuizzesPage() {
    const router = useRouter();
    const { language } = useLanguage();
    const { isAdmin } = useAdmin();
    const [quizSets, setQuizSets] = useState<QuizSet[]>([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [currentQuizSet, setCurrentQuizSet] = useState<QuizSet | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        // Get quiz sets from localStorage via our data service
        setQuizSets(getQuizSets());
        setIsLoading(false);
    }, []);

    // Filter quiz sets based on selected language
    const filteredQuizSets = quizSets.filter(set => set.language === language);

    // Function to handle adding a new quiz set
    const handleAddQuizSet = () => {
        setCurrentQuizSet({
            id: '',
            title: '',
            description: '',
            questionCount: 0,
            language: language
        });
        setEditDialogOpen(true);
    };

    // Function to handle editing a quiz set
    const handleEditQuizSet = (quizSet: QuizSet) => {
        setCurrentQuizSet({...quizSet});
        setEditDialogOpen(true);
    };

    // Function to handle deleting a quiz set
    const handleDeleteQuizSet = (id: string) => {
        if (confirm('Are you sure you want to delete this quiz set? This will also delete all associated questions.')) {
            const updatedQuizSets = deleteQuizSet(id);
            setQuizSets(updatedQuizSets);
            toast.success('Quiz set deleted successfully');
        }
    };

    // Function to save quiz set (add or update)
    const handleSaveQuizSet = (quizSet: QuizSet) => {
        // Form validation
        if (!quizSet.title || !quizSet.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            if (!quizSet.id) {
                // Generate an ID for new quiz sets based on language and title
                const titleSlug = quizSet.title.toLowerCase().replace(/\s+/g, '-');
                quizSet.id = `${quizSet.language.toLowerCase()}-${titleSlug}`;
            }
            
            const updatedQuizSets = saveQuizSet(quizSet);
            setQuizSets(updatedQuizSets);
            setEditDialogOpen(false);
            toast.success(`Quiz set ${quizSet.id ? 'updated' : 'added'} successfully`);
        } catch (error) {
            toast.error('Error saving quiz set');
            console.error(error);
        }
    };

    // Function to navigate to edit questions page
    const handleEditQuestions = (setId: string) => {
        router.push(`/learning/quizzes/${setId}/edit`);
    };

    return (
        <>
            {isAdmin && (
                <div className="flex justify-end mb-6">
                    <Button onClick={handleAddQuizSet}>
                        <Plus className="h-4 w-4 mr-2" /> Add Quiz Set
                    </Button>
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent"></div>
                    <p className="mt-4 text-gray-500">Loading quizzes...</p>
                </div>
            ) : filteredQuizSets.length > 0 ? (
                <div className="space-y-6">
                    {filteredQuizSets.map((set) => (
                        <Card key={set.id}>
                            <CardHeader>
                                <CardTitle>{set.title}</CardTitle>
                                <CardDescription>{set.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4 text-sm text-gray-500">
                                    {set.questionCount} questions
                                </div>
                                <Button 
                                    onClick={() => router.push(`/learning/quizzes/${set.id}`)} 
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    Start Quiz
                                </Button>
                            </CardContent>
                            {isAdmin && (
                                <CardFooter className="flex justify-end space-x-2 pt-0">
                                    <Button variant="outline" size="sm" onClick={() => handleEditQuestions(set.id)}>
                                        <Edit className="h-4 w-4 mr-2" /> Edit Questions
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleEditQuizSet(set)}>
                                        <Edit className="h-4 w-4 mr-2" /> Edit Details
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => handleDeleteQuizSet(set.id)}>
                                        <Trash className="h-4 w-4 mr-2" /> Delete
                                    </Button>
                                </CardFooter>
                            )}
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="text-center py-8">
                        <p className="text-gray-500">No {language} quizzes available.</p>
                    </CardContent>
                </Card>
            )}

            {/* Add/Edit Quiz Set Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>{currentQuizSet?.id ? 'Edit' : 'Add'} Quiz Set</DialogTitle>
                    </DialogHeader>
                    {currentQuizSet && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">Title</Label>
                                <Input
                                    id="title"
                                    value={currentQuizSet.title}
                                    onChange={(e) => setCurrentQuizSet({...currentQuizSet, title: e.target.value})}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="description" className="text-right">Description</Label>
                                <Textarea
                                    id="description"
                                    value={currentQuizSet.description}
                                    onChange={(e) => setCurrentQuizSet({...currentQuizSet, description: e.target.value})}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="language" className="text-right">Language</Label>
                                <Select 
                                    value={currentQuizSet.language}
                                    onValueChange={(value) => setCurrentQuizSet({
                                        ...currentQuizSet, 
                                        language: value as 'ASL' | 'MSL'
                                    })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ASL">ASL</SelectItem>
                                        <SelectItem value="MSL">MSL</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={() => currentQuizSet && handleSaveQuizSet(currentQuizSet)}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
} 