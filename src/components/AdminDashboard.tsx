'use client'

import React, { useState, useEffect } from 'react';
import { User } from '@/context/AuthContext';
import { AdminStats } from '@/components/admin/AdminStats';
import { AdminQuickAccessPanel } from '@/components/admin/AdminQuickAccessPanel';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [pendingVerifications, setPendingVerifications] = useState(0);

  useEffect(() => {
    // Get user data from localStorage
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users: User[] = JSON.parse(storedUsers);
      setTotalUsers(users.length);
      
      // Count unverified users
      const unverifiedUsers = users.filter(user => user.isVerified !== true);
      setPendingVerifications(unverifiedUsers.length);
    }
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
        className="text-3xl font-bold"
        variants={itemVariants}
      >
        Admin Dashboard
      </motion.h2>
      
      <motion.div variants={itemVariants}>
        <AdminStats totalUsers={totalUsers} pendingVerifications={pendingVerifications} />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <AdminQuickAccessPanel userRole="admin" pendingVerifications={pendingVerifications} />
      </motion.div>
      
    </motion.div>
  );
};

export default AdminDashboard; 