'use client';

import React, { useEffect, useState } from 'react';
import { getTodayChallenge, DailyChallenge as DailyChallengeType } from '@/lib/services/dailyChallengeService';
import { Loader2, Sparkles, Lightbulb } from 'lucide-react';

interface DailyChallengeProps {
  language: 'ASL' | 'MSL';
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({ language }) => {
  const [challenge, setChallenge] = useState<DailyChallengeType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      setIsLoading(true);
      setShowHint(false);
      const todayChallenge = await getTodayChallenge(language);
      setChallenge(todayChallenge);
      setIsLoading(false);
    };

    fetchChallenge();
  }, [language]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-500/20 text-green-700 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-500/20 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-700';
    }
  };

  return (
    <div className="bg-signlang-primary rounded-2xl p-5 text-signlang-dark shadow-lg relative overflow-hidden">
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h4 className="font-bold text-lg">Daily Challenge</h4>
          </div>
          {challenge && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${getDifficultyColor(challenge.difficulty)}`}>
              {challenge.difficulty}
            </span>
          )}
        </div>
        <p className="text-signlang-dark/80 text-xs mb-3">Practice makes perfect!</p>

        {/* Challenge Content */}
        <div className="bg-white/30 rounded-lg p-3 backdrop-blur-sm border border-white/20 mb-3 min-h-[60px] flex items-center justify-center">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-signlang-dark/60" />
          ) : challenge ? (
            <p className="text-sm font-medium text-center">{challenge.challenge_text}</p>
          ) : (
            <p className="text-sm text-signlang-dark/60 text-center">No challenge available</p>
          )}
        </div>

        {/* Hint Section */}
        {challenge?.hint && !isLoading && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 text-xs text-signlang-dark/70 hover:text-signlang-dark transition-colors"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            {showHint ? 'Hide hint' : 'Need a hint?'}
          </button>
        )}

        {showHint && challenge?.hint && (
          <div className="mt-2 p-2 bg-white/20 rounded-lg border border-white/10">
            <p className="text-xs text-signlang-dark/80">{challenge.hint}</p>
          </div>
        )}


      </div>

      {/* Decorative Background */}
      <div className="absolute top-0 right-0 p-8 w-32 h-32 bg-white/20 rounded-full -mr-10 -mt-10 blur-xl" />
    </div>
  );
};

export default DailyChallenge;
