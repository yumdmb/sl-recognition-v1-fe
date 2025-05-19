'use client'

import { useAuth } from '@/context/AuthContext';
import AdminDashboard from '@/components/AdminDashboard';
import UserDashboard from '@/components/UserDashboard';

export default function Dashboard() {
  const { currentUser } = useAuth();

  return (
    <>
      {currentUser?.role === 'admin' ? (
        <AdminDashboard />
      ) : (
        <UserDashboard userRole={currentUser?.role as 'user' | 'deaf' || 'user'} />
      )}
    </>
  );
} 