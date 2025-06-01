'use client'

import React, { useState, useEffect } from 'react';
import { User } from '@/context/AuthContext';
import { AdminStats } from '@/components/admin/AdminStats';
import { AdminQuickAccessPanel } from '@/components/admin/AdminQuickAccessPanel';
import { AdminNotificationCenter } from '@/components/admin/AdminNotificationCenter';
import { AdminActivitySummary } from '@/components/admin/AdminActivitySummary';
import { AdminProgressChart } from '@/components/admin/AdminProgressChart';

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
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Admin Dashboard</h2>
      
      <AdminStats totalUsers={totalUsers} pendingVerifications={pendingVerifications} />
      
      <AdminQuickAccessPanel userRole="admin" pendingVerifications={pendingVerifications} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminNotificationCenter userRole="admin" pendingVerifications={pendingVerifications} />
        <AdminActivitySummary userRole="admin" />
      </div>
      
      <AdminProgressChart userRole="admin" />
    </div>
  );
};

export default AdminDashboard; 