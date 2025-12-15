'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

type SidebarState = {
  isOpen: boolean;
  isMobile: boolean;
};

type SidebarContextType = {
  state: SidebarState;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
  setMobile: (isMobile: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const STORAGE_KEY = 'signbridge_sidebar_state';

interface PersistedSidebarState {
  desktopExpanded: boolean;
  lastUpdated: number;
}

// Load sidebar state from localStorage with fallback defaults
function loadFromLocalStorage(): PersistedSidebarState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as PersistedSidebarState;
      return parsed;
    }
  } catch (error) {
    console.warn('Failed to load sidebar state from localStorage:', error);
  }
  
  // Return default state if loading fails
  return {
    desktopExpanded: true,
    lastUpdated: Date.now(),
  };
}

// Save sidebar state to localStorage with error handling
function saveToLocalStorage(state: PersistedSidebarState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save sidebar state to localStorage:', error);
  }
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobileDetected = useIsMobile();
  
  // Initialize state with persisted desktop preference
  const [state, setState] = useState<SidebarState>(() => {
    const persisted = loadFromLocalStorage();
    return {
      isOpen: persisted.desktopExpanded,
      isMobile: false, // Will be updated by useEffect
    };
  });

  // Update isMobile state when detection changes
  useEffect(() => {
    setState(prev => ({ ...prev, isMobile: isMobileDetected }));
    
    // On mobile, always start with sidebar closed
    if (isMobileDetected) {
      setState(prev => ({ ...prev, isOpen: false }));
    } else {
      // On desktop, restore persisted state
      const persisted = loadFromLocalStorage();
      setState(prev => ({ ...prev, isOpen: persisted.desktopExpanded }));
    }
  }, [isMobileDetected]);

  const toggleSidebar = () => {
    setState(prev => {
      const newIsOpen = !prev.isOpen;
      
      // Persist desktop sidebar state
      if (!prev.isMobile) {
        saveToLocalStorage({
          desktopExpanded: newIsOpen,
          lastUpdated: Date.now(),
        });
      }
      
      return { ...prev, isOpen: newIsOpen };
    });
  };

  const openSidebar = () => {
    setState(prev => {
      // Persist desktop sidebar state
      if (!prev.isMobile) {
        saveToLocalStorage({
          desktopExpanded: true,
          lastUpdated: Date.now(),
        });
      }
      
      return { ...prev, isOpen: true };
    });
  };

  const closeSidebar = () => {
    setState(prev => {
      // Persist desktop sidebar state
      if (!prev.isMobile) {
        saveToLocalStorage({
          desktopExpanded: false,
          lastUpdated: Date.now(),
        });
      }
      
      return { ...prev, isOpen: false };
    });
  };

  const setMobile = (isMobile: boolean) => {
    setState(prev => ({ ...prev, isMobile }));
  };

  return (
    <SidebarContext.Provider
      value={{
        state,
        toggleSidebar,
        openSidebar,
        closeSidebar,
        setMobile,
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