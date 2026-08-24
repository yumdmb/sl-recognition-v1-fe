'use client'

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { AdminStats } from '@/components/admin/AdminStats';
import { AdminQuickAccessPanel } from '@/components/admin/AdminQuickAccessPanel';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const AdminDashboard: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [deafUsers, setDeafUsers] = useState(0);
  const [nonDeafUsers, setNonDeafUsers] = useState(0);
  const [pendingGestureContributions, setPendingGestureContributions] = useState(0);
  const [pendingAvatarContributions, setPendingAvatarContributions] = useState(0);
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

    const fetchPendingGestureContributions = async () => {
      const supabase = createClient();
      const { count, error } = await supabase
        .from('gesture_contributions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (error) {
        console.error('Error fetching pending gesture contributions:', error);
        return;
      }

      setPendingGestureContributions(count || 0);
    };

    const fetchPendingAvatarContributions = async () => {
      const supabase = createClient();
      const { count, error } = await supabase
        .from('sign_avatars')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (error) {
        console.error('Error fetching pending avatar contributions:', error);
        return;
      }

      setPendingAvatarContributions(count || 0);
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
    fetchPendingGestureContributions();
    fetchPendingAvatarContributions();
    fetchActiveLearners();
  }, []);

  return (
    <motion.div className="space-y-6" initial="hidden" animate="visible">
      <motion.div variants={fadeUp} custom={0} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Admin overview</p>
          <h2 className="font-display mt-1 text-3xl font-extrabold tracking-tight">
            Platform at a glance
          </h2>
          <p className="mt-1.5 text-muted-foreground">
            Moderate contributions and keep the learning content fresh.
          </p>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} custom={1}>
        <AdminStats
          totalUsers={totalUsers}
          deafUsers={deafUsers}
          nonDeafUsers={nonDeafUsers}
          pendingGestureContributions={pendingGestureContributions}
          pendingAvatarContributions={pendingAvatarContributions}
          proficiencyDistribution={proficiencyDistribution}
          activeLearners={activeLearners}
        />
      </motion.div>

      <motion.div variants={fadeUp} custom={2}>
        <AdminQuickAccessPanel userRole="admin" />
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
