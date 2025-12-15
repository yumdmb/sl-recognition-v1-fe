'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
  isRoleLoading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(true);
  const { currentUser, isLoading: isAuthLoading } = useAuth();

  // Check admin status based on user role from database profile
  useEffect(() => {
    if (isAuthLoading) {
      setIsRoleLoading(true);
      return;
    }

    if (currentUser) {
      // Primary check: use role from database profile (most reliable)
      // Fallback: check specific admin email as backup
      const isAdminUser = currentUser.role === 'admin' || 
                          currentUser.email === 'elvissawing.muran@gmail.com';
      setIsAdmin(isAdminUser);
      setIsRoleLoading(false);
    } else {
      setIsAdmin(false);
      setIsRoleLoading(false);
    }
  }, [currentUser, isAuthLoading]);

  return (
    <AdminContext.Provider value={{ isAdmin, setIsAdmin, isRoleLoading }}>
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