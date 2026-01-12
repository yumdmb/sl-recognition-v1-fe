'use client'

import React, { useState } from 'react';
import { UserQuickAccessPanel } from '@/components/user/UserQuickAccessPanel';
import LearningProgress from '@/components/user/LearningProgress';
import QuizProgress from '@/components/user/QuizProgress';
import LearningPathPanel from '@/components/user/LearningPathPanel';
import DailyChallenge from '@/components/user/DailyChallenge';
import { motion } from 'framer-motion';

type LanguageType = 'ASL' | 'MSL';

interface UserDashboardProps {
  userRole: 'non-deaf' | 'deaf';
  userName?: string;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ 
  userRole, // eslint-disable-line @typescript-eslint/no-unused-vars
  userName 
}) => {
  const [activeLanguage, setActiveLanguage] = useState<LanguageType>('ASL');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="relative isolate">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 -z-10 w-96 h-96 bg-signlang-primary/5 rounded-full blur-3xl opacity-50" />
      <div className="absolute top-20 right-0 -z-10 w-80 h-80 bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50" />

      <motion.div
        className="max-w-7xl mx-auto space-y-8 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section with Language Toggle */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {userName || 'User'}! 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Ready to continue your sign language journey today?
            </p>
          </div>
          
          {/* Language Toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg shadow-sm">
            <button 
              onClick={() => setActiveLanguage('ASL')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${
                activeLanguage === 'ASL' 
                  ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              🇺🇸 ASL
            </button>
            <button 
              onClick={() => setActiveLanguage('MSL')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${
                activeLanguage === 'MSL' 
                  ? 'bg-white dark:bg-slate-600 text-slate-800 dark:text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              🇲🇾 MSL
            </button>
          </div>
        </motion.div>

        {/* Top Row: KPI Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={itemVariants}
        >
          <LearningProgress language={activeLanguage} />
          <QuizProgress language={activeLanguage} />
        </motion.div>
        
        {/* Main Content: Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Learning Path (2/3 width) */}
          <motion.div className="lg:col-span-2 space-y-6" variants={itemVariants}>
            <LearningPathPanel language={activeLanguage} />
          </motion.div>
          
          {/* Right Column: Quick Access (1/3 width) */}
          <motion.div className="space-y-6" variants={itemVariants}>
             <UserQuickAccessPanel />
             
             {/* Daily Challenge */}
             <DailyChallenge language={activeLanguage} />
          </motion.div>
          
        </div>
      </motion.div>
    </div>
  );
};

export default UserDashboard;