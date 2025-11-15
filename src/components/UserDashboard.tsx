'use client'

import React from 'react';
import { UserQuickAccessPanel } from '@/components/user/UserQuickAccessPanel';
import LearningProgress from '@/components/user/LearningProgress';
import QuizProgress from '@/components/user/QuizProgress';
import LearningPathPanel from '@/components/user/LearningPathPanel';
import { motion } from 'framer-motion';

interface UserDashboardProps {
  userRole: 'non-deaf' | 'deaf';
}

const UserDashboard: React.FC<UserDashboardProps> = ({ userRole }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-3xl font-bold"
        variants={itemVariants}
      >
        {userRole === 'deaf' ? 'Deaf Person Dashboard' : 'Non-Deaf Person Dashboard'}
      </motion.h2>
      
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={itemVariants}
      >
        <LearningProgress />
        <QuizProgress />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <LearningPathPanel />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <UserQuickAccessPanel userRole={userRole} />
      </motion.div>
    </motion.div>
  );
};

export default UserDashboard;