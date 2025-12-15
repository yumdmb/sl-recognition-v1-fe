'use client'

import React, { useState, useEffect } from 'react';
import { User } from '@/context/AuthContext';
import { createClient } from '@/utils/supabase/client';
import { AdminStats } from '@/components/admin/AdminStats';
import { AdminQuickAccessPanel } from '@/components/admin/AdminQuickAccessPanel';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [deafUsers, setDeafUsers] = useState(0);
  const [nonDeafUsers, setNonDeafUsers] = useState(0);
  useEffect(() => {
    type UserProfile = {
      role: string;
    };

    const fetchUserStats = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .neq('role', 'admin');

      if (error) {
        console.error('Error fetching user stats:', error);
        return;
      }

      const profiles: UserProfile[] = data || [];
      setTotalUsers(profiles.length);
      setDeafUsers(profiles.filter(u => u.role === 'deaf').length);
      setNonDeafUsers(profiles.filter(u => u.role === 'non-deaf').length);
    };

    fetchUserStats();
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
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-2xl md:text-3xl font-bold"
        variants={itemVariants}
      >
        Admin Dashboard
      </motion.h2>
      
      <motion.div variants={itemVariants}>
        <AdminStats
          totalUsers={totalUsers}
          deafUsers={deafUsers}
          nonDeafUsers={nonDeafUsers}
        />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <AdminQuickAccessPanel userRole="admin" />
      </motion.div>
      
    </motion.div>
  );
};

export default AdminDashboard; 