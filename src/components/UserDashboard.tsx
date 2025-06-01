'use client'

import React from 'react';
import { UserQuickAccessPanel } from '@/components/user/UserQuickAccessPanel';
import { UserNotificationCenter } from '@/components/user/UserNotificationCenter';
import UserActivitySummary from '@/components/user/UserActivitySummary';
import UserProgressChart from '@/components/user/UserProgressChart';
import LearningProgress from '@/components/user/LearningProgress';
import QuizProgress from '@/components/user/QuizProgress';

interface UserDashboardProps {
  userRole: 'non-deaf' | 'deaf';
}

const UserDashboard: React.FC<UserDashboardProps> = ({ userRole }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">{userRole === 'deaf' ? 'Deaf Person Dashboard' : 'Non-Deaf Person Dashboard'}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <LearningProgress />
        <QuizProgress />
      </div>
      
      <UserQuickAccessPanel userRole={userRole} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserNotificationCenter userRole={userRole} />
        <UserActivitySummary userRole={userRole} />
      </div>
      
      <UserProgressChart userRole={userRole} />
    </div>
  );
};

export default UserDashboard;