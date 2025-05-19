'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UserDashboardProps {
  userRole: 'user' | 'deaf';
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
const QuickAccessPanel = ({ userRole }: { userRole: 'user' | 'deaf' }) => (
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

const NotificationCenter = ({ userRole }: { userRole: 'user' | 'deaf' }) => (
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

const ActivitySummary = ({ userRole }: { userRole: 'user' | 'deaf' }) => (
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

const ProgressChart = ({ userRole }: { userRole: 'user' | 'deaf' }) => (
  <Card>
    <CardContent className="p-6">
      <h3 className="text-lg font-medium mb-4">Learning Progress</h3>
      <div className="h-64 flex items-center justify-center text-gray-500">
        [Chart would be implemented here]
      </div>
    </CardContent>
  </Card>
);

const QuizProgress = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-lg flex items-center">
        <Award className="mr-2 h-5 w-5" /> Quiz Progress
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Alphabet Quiz</span>
            <span className="text-sm font-medium">90%</span>
          </div>
          <Progress value={90} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Basic Phrases</span>
            <span className="text-sm font-medium">75%</span>
          </div>
          <Progress value={75} className="h-2" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Advanced Conversations</span>
            <span className="text-sm font-medium">30%</span>
          </div>
          <Progress value={30} className="h-2" />
        </div>
        
        <div className="bg-signlang-muted p-4 rounded-md mt-6">
          <h4 className="font-medium mb-2">Quiz Achievements</h4>
          <div className="flex flex-wrap gap-2">
            <Badge>Perfect Score</Badge>
            <Badge>Fast Learner</Badge>
            <Badge>Consistent Practice</Badge>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const LearningProgress: React.FC = () => {
  const [courses, setCourses] = useState<CourseProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock API call - in a real app, this would fetch data from a backend service
    setTimeout(() => {
      const mockCourses: CourseProgress[] = [
        {
          id: '1',
          title: 'Sign Language Basics',
          progress: 100,
          totalLessons: 10,
          completedLessons: 10,
          level: 'beginner'
        },
        {
          id: '2',
          title: 'Everyday Conversations',
          progress: 60,
          totalLessons: 12,
          completedLessons: 7,
          level: 'beginner'
        },
        {
          id: '3',
          title: 'Intermediate Expressions',
          progress: 25,
          totalLessons: 15,
          completedLessons: 4,
          level: 'intermediate'
        },
        {
          id: '4',
          title: 'Advanced Communication',
          progress: 0,
          totalLessons: 20,
          completedLessons: 0,
          level: 'advanced'
        }
      ];
      
      setCourses(mockCourses);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const totalProgress = courses.length > 0 
    ? Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length) 
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
              <div className="text-lg font-bold">{courses.length}</div>
              <p className="text-xs text-gray-500">Courses</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-lg font-bold">
                {courses.reduce((sum, course) => sum + course.completedLessons, 0)}
              </div>
              <p className="text-xs text-gray-500">Lessons Completed</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-lg font-bold">
                {courses.reduce((sum, course) => sum + course.totalLessons, 0)}
              </div>
              <p className="text-xs text-gray-500">Total Lessons</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {courses.map(course => (
              <div key={course.id}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <span className="text-sm">{course.title}</span>
                    <Badge 
                      variant="outline" 
                      className={`ml-2 capitalize ${
                        course.level === 'beginner' 
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : course.level === 'intermediate'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-purple-100 text-purple-800 border-purple-200'
                      }`}
                    >
                      {course.level}
                    </Badge>
                  </div>
                  <span className="text-sm font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {course.completedLessons} of {course.totalLessons} lessons completed
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const UserDashboard: React.FC<UserDashboardProps> = ({ userRole }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">{userRole === 'deaf' ? 'Deaf Person Dashboard' : 'User Dashboard'}</h2>
      
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