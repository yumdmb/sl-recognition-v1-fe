'use client'

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// All quiz questions, grouped by set
const quizData = {
  "asl-basic": [
    {
      id: "1",
      question: 'What is the ASL sign for "Thank You"?',
      options: [
        "Touch your chin and move your hand forward",
        "Wave your hand",
        "Tap your chest twice",
        "Point to your ear",
      ],
      correctAnswer: 0,
      explanation: 'The ASL sign for "Thank You" is made by touching your chin and moving your hand forward.',
      level: "beginner",
      language: "ASL"
    },
    {
      id: "2",
      question: 'Which gesture means "Help" in ASL?',
      options: [
        "Raise your hand",
        "Thumbs up on an open palm",
        "Clap twice",
        "Touch your nose",
      ],
      correctAnswer: 1,
      explanation: 'A thumbs up on an open palm means "Help" in ASL.',
      level: "beginner",
      language: "ASL"
    },
    {
      id: "3",
      question: 'How do you sign "Understand" in ASL?',
      options: [
        "Point to your head and nod",
        "Flick your index finger up near your forehead",
        "Wave both hands",
        "Touch your heart",
      ],
      correctAnswer: 1,
      explanation: 'Flicking your index finger up near your forehead means "Understand" in ASL.',
      level: "beginner",
      language: "ASL"
    },
    {
      id: "4",
      question: 'What is the advanced sign for "Responsibility" in ASL?',
      options: [
        "Tap your shoulder with a flat hand",
        "Circle your hand over your heart",
        "Touch your chin and move outward",
        "Cross your arms",
      ],
      correctAnswer: 0,
      explanation: 'Tapping your shoulder with a flat hand means "Responsibility" in ASL.',
      level: "advanced",
      language: "ASL"
    },
  ],
  "asl-intermediate": [
    {
      id: "5",
      question: 'What is the ASL sign for "Friend"?',
      options: [
        "Hook your index fingers together",
        "Wave both hands",
        "Tap your chest",
        "Touch your nose",
      ],
      correctAnswer: 0,
      explanation: 'Hooking your index fingers together means "Friend" in ASL.',
      level: "intermediate",
      language: "ASL"
    },
    {
      id: "6",
      question: 'How do you sign "Family" in ASL?',
      options: [
        "Make a circle with both hands",
        "Touch your chin and move outward",
        "Cross your arms",
        "Tap your shoulder",
      ],
      correctAnswer: 0,
      explanation: 'Making a circle with both hands means "Family" in ASL.',
      level: "intermediate",
      language: "ASL"
    },
    {
      id: "7",
      question: 'What is the ASL sign for "School"?',
      options: [
        "Clap your hands together twice",
        "Wave your hand",
        "Point to your ear",
        "Tap your chest twice",
      ],
      correctAnswer: 0,
      explanation: 'Clapping your hands together twice means "School" in ASL.',
      level: "intermediate",
      language: "ASL"
    },
  ],
  "asl-advanced": [
    {
      id: "8",
      question: 'How do you sign "Responsibility" in ASL?',
      options: [
        "Tap your shoulder with a flat hand",
        "Circle your hand over your heart",
        "Touch your chin and move outward",
        "Cross your arms",
      ],
      correctAnswer: 0,
      explanation: 'Tapping your shoulder with a flat hand means "Responsibility" in ASL.',
      level: "advanced",
      language: "ASL"
    },
    {
      id: "9",
      question: 'What is the ASL sign for "Opportunity"?',
      options: [
        "Make an O shape and move forward",
        "Wave both hands",
        "Tap your chest twice",
        "Touch your nose",
      ],
      correctAnswer: 0,
      explanation: 'Making an O shape and moving forward means "Opportunity" in ASL.',
      level: "advanced",
      language: "ASL"
    },
  ],
  "msl-basic": [
    {
      id: "10",
      question: 'What is the MSL sign for "Thank You"?',
      options: [
        "Place your palm on your chin and move forward",
        "Place your open hand on your chest",
        "Tap your forehead twice",
        "Wave your hand from side to side",
      ],
      correctAnswer: 1,
      explanation: 'Placing your open hand on your chest means "Thank You" in MSL.',
      level: "beginner",
      language: "MSL"
    },
    {
      id: "11",
      question: 'How do you sign "Hello" in MSL?',
      options: [
        "Wave your hand side to side",
        "Touch your forehead and move outward",
        "Make a circular motion with your hand",
        "Tap your shoulder twice",
      ],
      correctAnswer: 0,
      explanation: 'Waving your hand side to side means "Hello" in MSL.',
      level: "beginner",
      language: "MSL"
    },
    {
      id: "12",
      question: 'What is the MSL sign for "Help"?',
      options: [
        "Cross your arms over your chest",
        "Make a fist with one hand and support it with the other",
        "Tap your shoulders alternately",
        "Point to your palm",
      ],
      correctAnswer: 1,
      explanation: 'Making a fist with one hand and supporting it with the other means "Help" in MSL.',
      level: "beginner",
      language: "MSL"
    },
    {
      id: "13",
      question: 'Which gesture means "Family" in MSL?',
      options: [
        "Draw a circle in the air",
        "Make a fist and tap your chest",
        "Cross your arms and then open them",
        "Touch your fingers together in front of you",
      ],
      correctAnswer: 3,
      explanation: 'Touching your fingers together in front of you means "Family" in MSL.',
      level: "beginner",
      language: "MSL"
    },
    {
      id: "14",
      question: 'How do you sign "Friend" in MSL?',
      options: [
        "Link your index fingers together",
        "Touch your heart and then point outward",
        "Pat your shoulder once",
        "Make a circle with both hands",
      ],
      correctAnswer: 0,
      explanation: 'Linking your index fingers together means "Friend" in MSL.',
      level: "beginner",
      language: "MSL"
    },
  ],
  "msl-intermediate": [
    {
      id: "15",
      question: 'What is the MSL sign for "Work"?',
      options: [
        "Make fists and move them up and down alternately",
        "Touch your forehead and move outward",
        "Clap your hands together",
        "Cross your arms",
      ],
      correctAnswer: 0,
      explanation: 'Making fists and moving them up and down alternately means "Work" in MSL.',
      level: "intermediate",
      language: "MSL"
    },
    {
      id: "16",
      question: 'How do you sign "School" in MSL?',
      options: [
        "Make a writing motion on your palm",
        "Touch your temple and open your hand",
        "Clap your hands twice",
        "Draw a square in the air",
      ],
      correctAnswer: 0,
      explanation: 'Making a writing motion on your palm means "School" in MSL.',
      level: "intermediate",
      language: "MSL"
    },
    {
      id: "17",
      question: 'What is the MSL sign for "Time"?',
      options: [
        "Point to your wrist",
        "Make a circular motion with your finger",
        "Tap your forehead",
        "Cross your arms and then open them",
      ],
      correctAnswer: 0,
      explanation: 'Pointing to your wrist means "Time" in MSL.',
      level: "intermediate",
      language: "MSL"
    },
    {
      id: "18",
      question: 'How do you sign "Tomorrow" in MSL?',
      options: [
        "Point forward and upward",
        "Touch your chin and move outward",
        "Make a circle with your finger and then point forward",
        "Tap your shoulder twice",
      ],
      correctAnswer: 0,
      explanation: 'Pointing forward and upward means "Tomorrow" in MSL.',
      level: "intermediate",
      language: "MSL"
    },
  ],
};

export default function QuizPage() {
  const params = useParams();
  const setId = params?.setId as string;
  const router = useRouter();
  const questions = quizData[setId as keyof typeof quizData] || [];
  const { language } = useLanguage();

  const [selectedAnswers, setSelectedAnswers] = useState<{ [id: string]: number | null }>({});
  const [showResults, setShowResults] = useState(false);

  // Check if this quiz belongs to the selected language
  useEffect(() => {
    if (questions.length > 0 && questions[0].language !== language) {
      router.push("/learning/quizzes");
    }
  }, [questions, language, router]);

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Quiz Not Found</h1>
        <p className="mb-4">This quiz may not be available in {language}.</p>
        <Button
          onClick={() => router.push("/learning/quizzes")}
        >
          Back to Quiz List
        </Button>
      </div>
    );
  }

  const handleSelect = (questionId: string, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  const correctCount = questions.reduce((acc, q) => {
    if (selectedAnswers[q.id] === q.correctAnswer) return acc + 1;
    return acc;
  }, 0);

  // Extract quiz title from setId (e.g., "asl-basic" -> "ASL Basic")
  const formatQuizTitle = (id: string) => {
    if (!id) return "";
    const parts = id.split('-');
    if (parts.length < 2) return id;
    return `${parts[0].toUpperCase()} ${parts[1].charAt(0).toUpperCase() + parts[1].slice(1)}`;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Button
        className="mb-4"
        onClick={() => router.push("/learning/quizzes")}
      >
        ← Back to Quiz List
      </Button>
      <h1 className="text-3xl font-bold mb-2">Quiz: {formatQuizTitle(setId || "")}</h1>
      <p className="mb-8 text-gray-600">
        Answer all questions below and submit to see your score and explanations.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {questions.map((quiz, idx) => (
            <Card key={quiz.id} className="overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" /> Question {idx + 1}
                  </CardTitle>
                  <CardDescription>{quiz.question}</CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className={`capitalize ${quiz.level === "beginner"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : quiz.level === "intermediate"
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : "bg-purple-100 text-purple-800 border-purple-200"
                    }`}
                >
                  {quiz.level}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quiz.options.map((option, optIdx) => {
                    const isSelected = selectedAnswers[quiz.id] === optIdx;
                    const isCorrect = quiz.correctAnswer === optIdx;
                    return (
                      <label
                        key={optIdx}
                        className={`flex items-center px-3 py-2 rounded-md border cursor-pointer transition
                          ${showResults
                            ? isCorrect
                              ? "border-green-500 bg-green-50"
                              : isSelected
                                ? "border-red-500 bg-red-50"
                                : "border-gray-200"
                            : isSelected
                              ? "border-primary bg-primary/10"
                              : "border-gray-200"
                          }
                        `}
                      >
                        <input
                          type="radio"
                          name={`quiz-${quiz.id}`}
                          value={optIdx}
                          checked={isSelected}
                          disabled={showResults}
                          onChange={() => handleSelect(quiz.id, optIdx)}
                          className="mr-3"
                        />
                        <span>{option}</span>
                        {showResults && isSelected && (
                          isCorrect ? (
                            <CheckCircle className="ml-2 h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="ml-2 h-5 w-5 text-red-500" />
                          )
                        )}
                      </label>
                    );
                  })}
                  
                  {showResults && (
                    <div className={`mt-4 p-3 rounded-md ${selectedAnswers[quiz.id] === quiz.correctAnswer ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
                      <p className="font-medium text-sm">
                        {selectedAnswers[quiz.id] === quiz.correctAnswer ? "Correct!" : "Explanation:"}
                      </p>
                      <p className="text-sm mt-1">{quiz.explanation}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 flex justify-between">
          {!showResults ? (
            <Button 
              type="submit" 
              disabled={Object.keys(selectedAnswers).length !== questions.length}
            >
              Submit Answers
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleRetry}
              >
                Try Again
              </Button>
              <div className="bg-primary/10 px-4 py-2 rounded-md flex items-center">
                <span className="mr-2">Your Score:</span>
                <span className="font-bold text-lg">
                  {correctCount} / {questions.length}
                </span>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
} 