'use client'

import React, { createContext, useContext, useState } from 'react';

type SidebarState = {
  isOpen: boolean;
};

type SidebarContextType = {
  state: SidebarState;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SidebarState>({
    isOpen: true,
  });

  const toggleSidebar = () => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const openSidebar = () => {
    setState(prev => ({ ...prev, isOpen: true }));
  };

  const closeSidebar = () => {
    setState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <SidebarContext.Provider
      value={{
        state,
        toggleSidebar,
        openSidebar,
        closeSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
} 