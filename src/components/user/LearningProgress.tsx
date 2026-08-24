'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Loader2 } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useLearning } from '@/context/LearningContext';
import { LearningRecommendation, getSimpleRecommendationsForLanguage } from '@/lib/services/recommendationEngine';

interface LearningProgressProps {
  language: 'ASL' | 'MSL';
}

const LearningProgress: React.FC<LearningProgressProps> = ({ language }) => {
  const { currentUser } = useAuth();
  const { tutorials, getTutorials } = useLearning();
  const [isLoading, setIsLoading] = useState(true);
  const [tutorialRecommendations, setTutorialRecommendations] = useState<LearningRecommendation[]>([]);

  // Get language-specific proficiency level
  const proficiencyLevel = language === 'ASL' 
    ? currentUser?.asl_proficiency_level 
    : currentUser?.msl_proficiency_level;

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load tutorials to get progress data
        if (getTutorials) {
          await getTutorials(language);
        }
        
        // Fetch learning path recommendations
        if (proficiencyLevel) {
          const recs = await getSimpleRecommendationsForLanguage(language, proficiencyLevel);
          // Filter to only tutorial type recommendations
          const tutorialRecs = recs.filter(rec => rec.type === 'tutorial');
          setTutorialRecommendations(tutorialRecs);
        } else {
          setTutorialRecommendations([]);
        }
      } catch (error) {
        console.error('Error loading learning progress:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [currentUser?.id, language, proficiencyLevel]); // eslint-disable-line react-hooks/exhaustive-deps

  // Create a map of tutorial progress
  const tutorialProgressMap = new Map(
    tutorials.map(t => [t.id, t.status || 'not-started'])
  );

  // Calculate progress metrics based on learning path tutorials
  const notStarted = tutorialRecommendations.filter(
    rec => !tutorialProgressMap.has(rec.id) || tutorialProgressMap.get(rec.id) === 'not-started'
  );
  
  const inProgress = tutorialRecommendations.filter(
    rec => tutorialProgressMap.get(rec.id) === 'started'
  );
  
  const completed = tutorialRecommendations.filter(
    rec => tutorialProgressMap.get(rec.id) === 'completed'
  );

  const totalTutorials = tutorialRecommendations.length;
  const totalProgress = totalTutorials > 0 
    ? Math.round((completed.length / totalTutorials) * 100)
    : 0;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="grid min-h-[220px] place-items-center">
          <div className="text-center">
            <Loader2 className="mx-auto size-6 animate-spin text-primary" />
            <p className="mt-3 text-sm text-muted-foreground">Loading your progress…</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gap-0 card-lift">
      <CardContent className="space-y-5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
            <BookOpen className="size-5" />
          </span>
          <div>
            <h3 className="font-display text-base font-bold">{language} Learning Path</h3>
            <p className="text-xs text-muted-foreground">Across recommended tutorials</p>
          </div>
        </div>

        <div>
          <div className="flex items-end justify-between">
            <span className="font-display text-4xl font-extrabold tracking-tight">{totalProgress}%</span>
            <span className="text-xs font-medium text-muted-foreground">
              {completed.length} of {totalTutorials} completed
            </span>
          </div>
          <Progress value={totalProgress} className="mt-3 h-2.5" />
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {[
            { label: 'Not started', value: notStarted.length },
            { label: 'In progress', value: inProgress.length },
            { label: 'Completed', value: completed.length },
          ].map((s) => (
            <div key={s.label} className="rounded-xl bg-muted px-3 py-2.5 text-center">
              <div className="font-display text-lg font-bold">{s.value}</div>
              <p className="text-[11px] font-medium text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningProgress;
