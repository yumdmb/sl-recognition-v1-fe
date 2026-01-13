'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { ProficiencyTestAdminService } from '@/lib/services/proficiencyTestAdminService';
import { ImageUploadField } from '@/components/ui/image-upload-field';
import { Plus, Pencil, Trash2, Image as ImageIcon, GripVertical, Check, X, Loader2 } from 'lucide-react';

interface Choice {
  id: string;
  question_id: string;
  choice_text: string;
  is_correct: boolean;
  image_url: string | null;
}

interface Question {
  id: string;
  test_id: string;
  question_text: string;
  order_index: number;
  image_url: string | null;
  choices: Choice[];
}

interface Test {
  id: string;
  title: string;
  description: string | null;
  language: string;
  questions: Question[];
}

export default function ManageProficiencyTestPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dialog states
  const [addQuestionDialogOpen, setAddQuestionDialogOpen] = useState(false);
  const [editQuestionDialogOpen, setEditQuestionDialogOpen] = useState(false);
  const [addChoiceDialogOpen, setAddChoiceDialogOpen] = useState(false);
  const [editChoiceDialogOpen, setEditChoiceDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Form states
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'question' | 'choice'; id: string } | null>(null);

  // New question form
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionImageUrl, setNewQuestionImageUrl] = useState('');

  // Edit question form
  const [editQuestionText, setEditQuestionText] = useState('');
  const [editQuestionImageUrl, setEditQuestionImageUrl] = useState('');

  // New choice form
  const [newChoiceText, setNewChoiceText] = useState('');
  const [newChoiceImageUrl, setNewChoiceImageUrl] = useState('');
  const [newChoiceIsCorrect, setNewChoiceIsCorrect] = useState(false);

  // Edit choice form
  const [editChoiceText, setEditChoiceText] = useState('');
  const [editChoiceImageUrl, setEditChoiceImageUrl] = useState('');
  const [editChoiceIsCorrect, setEditChoiceIsCorrect] = useState(false);

  const fetchTests = useCallback(async () => {
    try {
      const data = await ProficiencyTestAdminService.getAllTestsWithDetails();
      setTests(data as Test[]);
    } catch (error) {
      console.error('Error fetching tests:', error);
      toast.error('Failed to load tests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  // ===== Question CRUD =====
  const handleAddQuestion = async () => {
    if (!selectedTestId || !newQuestionText.trim()) return;

    setSaving(true);
    try {
      const test = tests.find(t => t.id === selectedTestId);
      const nextOrder = (test?.questions.length || 0) + 1;

      await ProficiencyTestAdminService.createQuestion(
        selectedTestId,
        newQuestionText.trim(),
        nextOrder,
        newQuestionImageUrl.trim() || undefined
      );

      toast.success('Question added successfully');
      setAddQuestionDialogOpen(false);
      setNewQuestionText('');
      setNewQuestionImageUrl('');
      fetchTests();
    } catch (error) {
      console.error('Error adding question:', error);
      toast.error('Failed to add question');
    } finally {
      setSaving(false);
    }
  };

  const handleEditQuestion = async () => {
    if (!selectedQuestion || !editQuestionText.trim()) return;

    setSaving(true);
    try {
      await ProficiencyTestAdminService.updateQuestion(selectedQuestion.id, {
        question_text: editQuestionText.trim(),
        image_url: editQuestionImageUrl.trim() || null,
      });

      toast.success('Question updated successfully');
      setEditQuestionDialogOpen(false);
      fetchTests();
    } catch (error) {
      console.error('Error updating question:', error);
      toast.error('Failed to update question');
    } finally {
      setSaving(false);
    }
  };

  const openEditQuestionDialog = (question: Question) => {
    setSelectedQuestion(question);
    setEditQuestionText(question.question_text);
    setEditQuestionImageUrl(question.image_url || '');
    setEditQuestionDialogOpen(true);
  };

  // ===== Choice CRUD =====
  const handleAddChoice = async () => {
    if (!selectedQuestion || !newChoiceText.trim()) return;

    setSaving(true);
    try {
      await ProficiencyTestAdminService.createChoice(
        selectedQuestion.id,
        newChoiceText.trim(),
        newChoiceIsCorrect,
        newChoiceImageUrl.trim() || undefined
      );

      toast.success('Choice added successfully');
      setAddChoiceDialogOpen(false);
      setNewChoiceText('');
      setNewChoiceImageUrl('');
      setNewChoiceIsCorrect(false);
      fetchTests();
    } catch (error) {
      console.error('Error adding choice:', error);
      toast.error('Failed to add choice');
    } finally {
      setSaving(false);
    }
  };

  const handleEditChoice = async () => {
    if (!selectedChoice || !editChoiceText.trim()) return;

    setSaving(true);
    try {
      await ProficiencyTestAdminService.updateChoice(selectedChoice.id, {
        choice_text: editChoiceText.trim(),
        is_correct: editChoiceIsCorrect,
        image_url: editChoiceImageUrl.trim() || null,
      });

      toast.success('Choice updated successfully');
      setEditChoiceDialogOpen(false);
      fetchTests();
    } catch (error) {
      console.error('Error updating choice:', error);
      toast.error('Failed to update choice');
    } finally {
      setSaving(false);
    }
  };

  const openEditChoiceDialog = (choice: Choice) => {
    setSelectedChoice(choice);
    setEditChoiceText(choice.choice_text);
    setEditChoiceImageUrl(choice.image_url || '');
    setEditChoiceIsCorrect(choice.is_correct);
    setEditChoiceDialogOpen(true);
  };

  const openAddChoiceDialog = (question: Question) => {
    setSelectedQuestion(question);
    setNewChoiceText('');
    setNewChoiceImageUrl('');
    setNewChoiceIsCorrect(false);
    setAddChoiceDialogOpen(true);
  };

  // ===== Delete =====
  const handleDelete = async () => {
    if (!deleteTarget) return;

    setSaving(true);
    try {
      if (deleteTarget.type === 'question') {
        await ProficiencyTestAdminService.deleteQuestion(deleteTarget.id);
        toast.success('Question deleted successfully');
      } else {
        await ProficiencyTestAdminService.deleteChoice(deleteTarget.id);
        toast.success('Choice deleted successfully');
      }
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      fetchTests();
    } catch (error) {
      console.error('Error deleting:', error);
      toast.error('Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (type: 'question' | 'choice', id: string) => {
    setDeleteTarget({ type, id });
    setDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-signlang-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Proficiency Tests</h1>
        <p className="text-muted-foreground mt-1">
          Add, edit, or delete questions and answer choices for proficiency tests.
        </p>
      </div>

      {tests.map((test) => (
        <Card key={test.id} className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-signlang-primary/10 to-signlang-secondary/10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {test.title}
                  <Badge variant="outline">{test.language}</Badge>
                </CardTitle>
                <CardDescription>{test.description}</CardDescription>
              </div>
              <Dialog open={addQuestionDialogOpen && selectedTestId === test.id} onOpenChange={(open) => {
                setAddQuestionDialogOpen(open);
                if (open) setSelectedTestId(test.id);
              }}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => setSelectedTestId(test.id)}>
                    <Plus className="h-4 w-4 mr-1" /> Add Question
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Question</DialogTitle>
                    <DialogDescription>Add a new question to {test.title}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="question-text">Question Text</Label>
                      <Textarea
                        id="question-text"
                        placeholder="Enter the question..."
                        value={newQuestionText}
                        onChange={(e) => setNewQuestionText(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <ImageUploadField
                      value={newQuestionImageUrl}
                      onChange={setNewQuestionImageUrl}
                      folder="questions"
                      label="Question Image"
                      disabled={saving}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddQuestionDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddQuestion} disabled={saving || !newQuestionText.trim()}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                      Add Question
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 text-sm text-muted-foreground">
              {test.questions.length} question{test.questions.length !== 1 ? 's' : ''}
            </div>
            <Accordion type="multiple" className="w-full">
              {test.questions.map((question, qIndex) => (
                <AccordionItem key={question.id} value={question.id} className="border-b">
                  <AccordionTrigger className="px-4 hover:no-underline hover:bg-muted/50">
                    <div className="flex items-center gap-3 text-left flex-1">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="secondary" className="shrink-0">Q{qIndex + 1}</Badge>
                      <span className="line-clamp-1">{question.question_text}</span>
                      {question.image_url && <ImageIcon className="h-4 w-4 text-blue-500 shrink-0" />}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    {question.image_url && (
                      <div className="mb-4 p-2 bg-muted rounded-lg">
                        <img
                          src={question.image_url}
                          alt="Question"
                          className="max-h-40 rounded object-contain"
                        />
                      </div>
                    )}

                    <div className="flex gap-2 mb-4">
                      <Button size="sm" variant="outline" onClick={() => openEditQuestionDialog(question)}>
                        <Pencil className="h-3 w-3 mr-1" /> Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => openAddChoiceDialog(question)}>
                        <Plus className="h-3 w-3 mr-1" /> Add Choice
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => confirmDelete('question', question.id)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Delete
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground uppercase">Answer Choices</Label>
                      {question.choices.length === 0 ? (
                        <p className="text-sm text-muted-foreground italic">No choices added yet</p>
                      ) : (
                        <div className="space-y-2">
                          {question.choices.map((choice) => (
                            <div
                              key={choice.id}
                              className={`flex items-center gap-3 p-3 rounded-lg border ${
                                choice.is_correct ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900' : 'bg-muted/30'
                              }`}
                            >
                              {choice.is_correct ? (
                                <Check className="h-4 w-4 text-green-600 shrink-0" />
                              ) : (
                                <X className="h-4 w-4 text-muted-foreground shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm">{choice.choice_text}</p>
                                {choice.image_url && (
                                  <img
                                    src={choice.image_url}
                                    alt="Choice"
                                    className="mt-2 max-h-20 rounded object-contain"
                                  />
                                )}
                              </div>
                              <div className="flex gap-1 shrink-0">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7"
                                  onClick={() => openEditChoiceDialog(choice)}
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-destructive hover:text-destructive"
                                  onClick={() => confirmDelete('choice', choice.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ))}

      {/* Edit Question Dialog */}
      <Dialog open={editQuestionDialogOpen} onOpenChange={setEditQuestionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-question-text">Question Text</Label>
              <Textarea
                id="edit-question-text"
                value={editQuestionText}
                onChange={(e) => setEditQuestionText(e.target.value)}
                rows={3}
              />
            </div>
            <ImageUploadField
              value={editQuestionImageUrl}
              onChange={setEditQuestionImageUrl}
              folder="questions"
              label="Question Image"
              disabled={saving}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditQuestionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditQuestion} disabled={saving || !editQuestionText.trim()}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Choice Dialog */}
      <Dialog open={addChoiceDialogOpen} onOpenChange={setAddChoiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Answer Choice</DialogTitle>
            <DialogDescription>Add a new choice to the question</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="choice-text">Choice Text</Label>
              <Input
                id="choice-text"
                placeholder="Enter the answer choice..."
                value={newChoiceText}
                onChange={(e) => setNewChoiceText(e.target.value)}
              />
            </div>
            <ImageUploadField
              value={newChoiceImageUrl}
              onChange={setNewChoiceImageUrl}
              folder="choices"
              label="Choice Image"
              disabled={saving}
            />
            <div className="flex items-center space-x-2">
              <Switch
                id="choice-correct"
                checked={newChoiceIsCorrect}
                onCheckedChange={setNewChoiceIsCorrect}
              />
              <Label htmlFor="choice-correct">This is the correct answer</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddChoiceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddChoice} disabled={saving || !newChoiceText.trim()}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Add Choice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Choice Dialog */}
      <Dialog open={editChoiceDialogOpen} onOpenChange={setEditChoiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Answer Choice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-choice-text">Choice Text</Label>
              <Input
                id="edit-choice-text"
                value={editChoiceText}
                onChange={(e) => setEditChoiceText(e.target.value)}
              />
            </div>
            <ImageUploadField
              value={editChoiceImageUrl}
              onChange={setEditChoiceImageUrl}
              folder="choices"
              label="Choice Image"
              disabled={saving}
            />
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-choice-correct"
                checked={editChoiceIsCorrect}
                onCheckedChange={setEditChoiceIsCorrect}
              />
              <Label htmlFor="edit-choice-correct">This is the correct answer</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditChoiceDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditChoice} disabled={saving || !editChoiceText.trim()}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.type === 'question'
                ? 'This will permanently delete the question and all its answer choices.'
                : 'This will permanently delete this answer choice.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
