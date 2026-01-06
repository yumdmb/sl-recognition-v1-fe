'use client'

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { AdminStats } from '@/components/admin/AdminStats';
import { AdminQuickAccessPanel } from '@/components/admin/AdminQuickAccessPanel';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [deafUsers, setDeafUsers] = useState(0);
  const [nonDeafUsers, setNonDeafUsers] = useState(0);
  const [pendingContributions, setPendingContributions] = useState(0);
  const [proficiencyDistribution, setProficiencyDistribution] = useState({
    beginner: 0,
    intermediate: 0,
    advanced: 0,
    unassessed: 0,
  });
  const [activeLearners, setActiveLearners] = useState(0);

  useEffect(() => {
    type UserProfile = {
      role: string;
      proficiency_level: string | null;
    };

    const fetchUserStats = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role, proficiency_level')
        .neq('role', 'admin');

      if (error) {
        console.error('Error fetching user stats:', error);
        return;
      }

      const profiles: UserProfile[] = data || [];
      setTotalUsers(profiles.length);
      setDeafUsers(profiles.filter(u => u.role === 'deaf').length);
      setNonDeafUsers(profiles.filter(u => u.role === 'non-deaf').length);
      
      // Calculate proficiency distribution
      setProficiencyDistribution({
        beginner: profiles.filter(u => u.proficiency_level === 'Beginner').length,
        intermediate: profiles.filter(u => u.proficiency_level === 'Intermediate').length,
        advanced: profiles.filter(u => u.proficiency_level === 'Advanced').length,
        unassessed: profiles.filter(u => !u.proficiency_level).length,
      });
    };

    const fetchPendingContributions = async () => {
      const supabase = createClient();
      const { count, error } = await supabase
        .from('gesture_contributions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (error) {
        console.error('Error fetching pending contributions:', error);
        return;
      }

      setPendingContributions(count || 0);
    };

    const fetchActiveLearners = async () => {
      const supabase = createClient();
      
      // Get unique users who have tutorial progress
      const { data: tutorialUsers, error: tutorialError } = await supabase
        .from('tutorial_progress')
        .select('user_id');

      // Get unique users who have quiz progress
      const { data: quizUsers, error: quizError } = await supabase
        .from('quiz_progress')
        .select('user_id');

      if (tutorialError || quizError) {
        console.error('Error fetching active learners:', tutorialError || quizError);
        return;
      }

      // Combine and get unique user IDs
      const allUserIds = new Set([
        ...(tutorialUsers || []).map(u => u.user_id).filter(Boolean),
        ...(quizUsers || []).map(u => u.user_id).filter(Boolean),
      ]);

      setActiveLearners(allUserIds.size);
    };

    fetchUserStats();
    fetchPendingContributions();
    fetchActiveLearners();
  }, []);

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
      className="space-y-4 md:space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-2xl md:text-3xl font-bold"
        variants={itemVariants}
      >
        Hi Admin!
      </motion.h2>
      
      <motion.div variants={itemVariants}>
        <AdminStats
          totalUsers={totalUsers}
          deafUsers={deafUsers}
          nonDeafUsers={nonDeafUsers}
          pendingContributions={pendingContributions}
          proficiencyDistribution={proficiencyDistribution}
          activeLearners={activeLearners}
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <AdminQuickAccessPanel userRole="admin" />
      </motion.div>
      
    </motion.div>
  );
};

export default AdminDashboard; 