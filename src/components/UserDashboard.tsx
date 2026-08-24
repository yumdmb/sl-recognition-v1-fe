'use client'

import React, { useState } from 'react';
import { UserQuickAccessPanel } from '@/components/user/UserQuickAccessPanel';
import LearningProgress from '@/components/user/LearningProgress';
import QuizProgress from '@/components/user/QuizProgress';
import LearningPathPanel from '@/components/user/LearningPathPanel';
import DailyChallenge from '@/components/user/DailyChallenge';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

type LanguageType = 'ASL' | 'MSL';

interface UserDashboardProps {
  userRole: 'non-deaf' | 'deaf';
  userName?: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const UserDashboard: React.FC<UserDashboardProps> = ({ userRole, userName }) => {
  const { currentUser } = useAuth();
  const firstName = (currentUser?.name || userName || 'there').split(' ')[0];
  const [activeLanguage, setActiveLanguage] = useState<LanguageType>('ASL');

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeUp} custom={0} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {new Date().toLocaleDateString('en-MY', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h2 className="font-display mt-1 text-3xl font-extrabold tracking-tight">
            Welcome back, {firstName}
          </h2>
          <p className="mt-1.5 text-muted-foreground">
            {userRole === 'deaf'
              ? 'Ready to keep the community dictionary growing?'
              : 'Keep your streak alive — a few minutes of practice goes a long way.'}
          </p>
        </div>
        {/* Language Toggle - from origin, styled botanically */}
        <div className="flex rounded-full bg-muted p-1">
          <button
            onClick={() => setActiveLanguage('ASL')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              activeLanguage === 'ASL'
                ? 'bg-background shadow-soft text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🇺🇸 ASL
          </button>
          <button
            onClick={() => setActiveLanguage('MSL')}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              activeLanguage === 'MSL'
                ? 'bg-background shadow-soft text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🇲🇾 MSL
          </button>
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        custom={1}
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        <LearningProgress language={activeLanguage} />
        <QuizProgress language={activeLanguage} />
      </motion.div>

      {/* Main Content: Split Layout - origin's LearningPath + DailyChallenge with botanical motion */}
      <motion.div variants={fadeUp} custom={2} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LearningPathPanel language={activeLanguage} />
        </div>
        <div className="space-y-6">
          <UserQuickAccessPanel userRole={userRole} />
          <DailyChallenge language={activeLanguage} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserDashboard;
