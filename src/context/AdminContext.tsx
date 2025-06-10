'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { currentUser } = useAuth();

  // Check admin status based on user metadata from Supabase
  useEffect(() => {
    if (currentUser) {
      // Check if user has admin role in their metadata or email is admin
      const isAdminUser = currentUser.email === 'elvissawing.muran@gmail.com' || 
                         currentUser.user_metadata?.role === 'admin' ||
                         currentUser.app_metadata?.role === 'admin';
      setIsAdmin(isAdminUser);
    } else {
      setIsAdmin(false);
    }
  }, [currentUser]);

  return (
    <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}