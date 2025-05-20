'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  getTutorials, 
  getQuizSets, 
  getUserProgress, 
  getOverallTutorialProgress, 
  getOverallQuizProgress 
} from '@/data/contentData';

interface UserDashboardProps {
  userRole: 'non-deaf' | 'deaf';
}

interface CourseProgress {
  id: string;
  title: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

// These components would be implemented separately as needed
const QuickAccessPanel = ({ userRole }: { userRole: 'non-deaf' | 'deaf' }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-2">Recognize Sign Language</h3>
        <p className="text-gray-500 mb-4">Upload images to identify signs</p>
        <Button className="w-full">Start Recognition</Button>
      </CardContent>
    </Card>
    
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-2">Continue Learning</h3>
        <p className="text-gray-500 mb-4">Resume your sign language lessons</p>
        <Button className="w-full">Go to Lessons</Button>
      </CardContent>
    </Card>
  </div>
);

const NotificationCenter = ({ userRole }: { userRole: 'non-deaf' | 'deaf' }) => (
  <Card>
    <CardContent className="p-6">
      <h3 className="text-lg font-medium mb-4">Recent Notifications</h3>
      <div className="space-y-4">
        <div className="flex gap-4 p-3 bg-green-50 border border-green-100 rounded-md">
          <div className="text-green-500">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">Achievement Unlocked!</p>
            <p className="text-sm text-gray-500">You've completed your first tutorial</p>
          </div>
        </div>
        <div className="flex gap-4 p-3 bg-blue-50 border border-blue-100 rounded-md">
          <div className="text-blue-500">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">New Learning Material</p>
            <p className="text-sm text-gray-500">Check out the new tutorial on greetings</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ActivitySummary = ({ userRole }: { userRole: 'non-deaf' | 'deaf' }) => (
  <Card>
    <CardContent className="p-6">
      <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
      <div className="space-y-4">
        <div className="border-l-4 border-green-400 pl-4">
          <p className="font-medium">Completed Quiz</p>
          <p className="text-sm text-gray-500">10 minutes ago</p>
        </div>
        <div className="border-l-4 border-blue-400 pl-4">
          <p className="font-medium">Started New Lesson</p>
          <p className="text-sm text-gray-500">2 hours ago</p>
        </div>
        <div className="border-l-4 border-purple-400 pl-4">
          <p className="font-medium">Practiced Recognition</p>
          <p className="text-sm text-gray-500">Yesterday at 15:30</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ProgressChart = ({ userRole }: { userRole: 'non-deaf' | 'deaf' }) => (
  <Card>
    <CardContent className="p-6">
      <h3 className="text-lg font-medium mb-4">Learning Progress</h3>
      <div className="h-64 flex items-center justify-center text-gray-500">
        [Chart would be implemented here]
      </div>
    </CardContent>
  </Card>
);

const QuizProgress = () => {
  const [quizProgress, setQuizProgress] = useState<{ completion: number; score: number }>({ completion: 0, score: 0 });
  const [quizSets, setQuizSets] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get current user ID from localStorage or your auth system
    const userId = localStorage.getItem('userId') || 'default-user';
    
    // Fetch quiz sets and user progress
    const quizSetsData = getQuizSets();
    const userProgressData = getUserProgress(userId);
    const overallProgress = getOverallQuizProgress(userId);
    
    setQuizSets(quizSetsData);
    setUserProgress(userProgressData);
    setQuizProgress(overallProgress);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-signlang-primary border-r-transparent"></div>
            <p className="mt-4 text-gray-500">Loading quiz progress...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Award className="mr-2 h-5 w-5" /> Quiz Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-signlang-primary">{quizProgress.score}%</div>
            <p className="text-sm text-gray-500 mt-1">Average Score</p>
            <Progress value={quizProgress.score} className="h-3 mt-2" />
          </div>

          {quizSets.map(quizSet => {
            const progress = userProgress?.quizzes.find((q: any) => q.quizId === quizSet.id);
            const progressPercentage = progress ? (progress.score / progress.totalQuestions) * 100 : 0;
            
            return (
              <div key={quizSet.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">{quizSet.title}</span>
                  <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                {progress && (
                  <p className="text-xs text-gray-500 mt-1">
                    Score: {progress.score}/{progress.totalQuestions} questions
                  </p>
                )}
              </div>
            );
          })}
          
          <div className="bg-signlang-muted p-4 rounded-md mt-6">
            <h4 className="font-medium mb-2">Quiz Achievements</h4>
            <div className="flex flex-wrap gap-2">
              {quizProgress.score >= 90 && <Badge>Perfect Score</Badge>}
              {quizProgress.completion >= 75 && <Badge>Fast Learner</Badge>}
              {userProgress?.quizzes.length >= 5 && <Badge>Consistent Practice</Badge>}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const LearningProgress: React.FC = () => {
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get current user ID from localStorage or your auth system
    const userId = localStorage.getItem('userId') || 'default-user';
    
    // Fetch tutorials and user progress
    const tutorialsData = getTutorials();
    const userProgressData = getUserProgress(userId);
    
    setTutorials(tutorialsData);
    setUserProgress(userProgressData);
    setIsLoading(false);
  }, []);

  const totalProgress = tutorials.length > 0 
    ? Math.round(tutorials.reduce((sum, tutorial) => {
        const progress = userProgress?.tutorials.find((t: any) => t.tutorialId === tutorial.id);
        return sum + (progress?.progress || 0);
      }, 0) / tutorials.length)
    : 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-signlang-primary border-r-transparent"></div>
            <p className="mt-4 text-gray-500">Loading your progress...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <BookOpen className="mr-2 h-5 w-5" /> Learning Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-signlang-primary">{totalProgress}%</div>
            <p className="text-sm text-gray-500 mt-1">Overall Completion</p>
            <Progress value={totalProgress} className="h-3 mt-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-lg font-bold">{tutorials.length}</div>
              <p className="text-xs text-gray-500">Courses</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-lg font-bold">
                {userProgress?.tutorials.filter((t: any) => t.progress === 100).length || 0}
              </div>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-lg font-bold">
                {userProgress?.tutorials.length || 0}
              </div>
              <p className="text-xs text-gray-500">In Progress</p>
            </div>
          </div>
          
          {tutorials.map(tutorial => {
            const progress = userProgress?.tutorials.find((t: any) => t.tutorialId === tutorial.id);
            const progressPercentage = progress?.progress || 0;
            
            return (
              <div key={tutorial.id}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <span className="text-sm">{tutorial.title}</span>
                    <Badge 
                      variant="outline" 
                      className={`ml-2 capitalize ${
                        tutorial.level === 'beginner' 
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : tutorial.level === 'intermediate'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-purple-100 text-purple-800 border-purple-200'
                      }`}
                    >
                      {tutorial.level}
                    </Badge>
                  </div>
                  <span className="text-sm font-medium">{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {progress ? `Last updated: ${new Date(progress.lastUpdated).toLocaleDateString()}` : 'Not started'}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const UserDashboard: React.FC<UserDashboardProps> = ({ userRole }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">{userRole === 'deaf' ? 'Deaf Person Dashboard' : 'Non-Deaf Person Dashboard'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <LearningProgress />
        <QuizProgress />
      </div>
      
      <QuickAccessPanel userRole={userRole} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NotificationCenter userRole={userRole} />
        <ActivitySummary userRole={userRole} />
      </div>
      
      <ProgressChart userRole={userRole} />
    </div>
  );
};

export default UserDashboard; 