'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { createClient } from '@/utils/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { UserService } from '@/lib/services/userService';
import type { UserProfile } from '@/types/database';

// Define our user type - extending Supabase user with custom metadata
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'non-deaf' | 'admin' | 'deaf';
  isVerified?: boolean;
  email_confirmed_at?: string;
}

// Define AuthContext interface
interface AuthContextProps {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: 'non-deaf' | 'deaf') => Promise<boolean>;
  updateUser: (user: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  resendConfirmation: (email: string) => Promise<boolean>;
}

// Create context with initial values
const AuthContext = createContext<AuthContextProps | null>(null);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();  // Convert Supabase user to our User type with database profile
  const convertSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User> => {
    try {
      // Try to get user profile from database
      const profile = await UserService.getUserProfile(supabaseUser.id);
      
      if (profile) {
        console.info('Successfully loaded user profile from database');
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          isVerified: !!supabaseUser.email_confirmed_at,
          email_confirmed_at: supabaseUser.email_confirmed_at
        };
      } else {
        console.info('No profile found in database, using metadata fallback');
      }
    } catch (error) {
      console.info('Failed to fetch user profile from database, using fallback. This is normal during RLS policy issues.');
      // Continue to fallback without throwing
    }

    // Fallback to metadata if profile doesn't exist or RLS blocks access
    const metadata = supabaseUser.user_metadata || {};
    const fallbackUser = {
      id: supabaseUser.id,
      name: metadata.name || metadata.full_name || supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email || '',
      role: (metadata.role as 'non-deaf' | 'admin' | 'deaf') || 'non-deaf',
      isVerified: !!supabaseUser.email_confirmed_at,
      email_confirmed_at: supabaseUser.email_confirmed_at
    };
    
    console.info('Using fallback user data:', { 
      id: fallbackUser.id, 
      name: fallbackUser.name, 
      email: fallbackUser.email, 
      role: fallbackUser.role 
    });
    
    return fallbackUser;
  };
  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        } else if (session?.user) {
          const user = await convertSupabaseUser(session.user);
          setCurrentUser(user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          const user = await convertSupabaseUser(session.user);
          setCurrentUser(user);
          setIsAuthenticated(true);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          toast.error("Email not verified", {
            description: "Please check your email and click the verification link before logging in.",
            action: {
              label: "Resend",
              onClick: () => resendConfirmation(email)
            }
          });
        } else if (error.message.includes('Invalid login credentials')) {
          toast.error("Login failed", {
            description: "Invalid email or password. Please try again."
          });
        } else {
          toast.error("Login failed", {
            description: error.message
          });
        }
        return false;
      }

      if (data.user) {
        toast.success("Login successful", {
          description: "Welcome back!"
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed", {
        description: "An unexpected error occurred. Please try again."
      });
      return false;
    }
  };

  // Register function
  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: 'non-deaf' | 'deaf'
  ): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          toast.error("Registration failed", {
            description: "Email is already in use. Please try a different email or login instead."
          });
        } else {
          toast.error("Registration failed", {
            description: error.message
          });
        }
        return false;
      }

      if (data.user) {
        toast.success("Registration successful", {
          description: "Please check your email and click the verification link to complete your registration."
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Registration failed", {
        description: "An unexpected error occurred. Please try again."
      });
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast.error("Logout failed", {
          description: error.message
        });
      } else {
        toast.success("Logged out successfully");
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  // Update user information
  const updateUser = async (updates: Partial<User>) => {
    try {
      if (!currentUser) throw new Error('No user logged in');

      // Update auth metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          name: updates.name,
          role: updates.role,
        }
      });

      if (authError) throw authError;

      // Update database profile
      const updatedProfile = await UserService.updateUserProfile(currentUser.id, {
        name: updates.name,
        role: updates.role,
      });

      // Update local state
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Update user error:', error);
      toast.error("Update failed", {
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again."
      });
    }
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        toast.error("Reset failed", {
          description: error.message
        });
        return false;
      }

      toast.success("Reset email sent", {
        description: "Please check your email for password reset instructions."
      });
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error("Reset failed", {
        description: "An unexpected error occurred. Please try again."
      });
      return false;
    }
  };

  // Resend email confirmation
  const resendConfirmation = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        toast.error("Resend failed", {
          description: error.message
        });
        return false;
      }

      toast.success("Verification email sent", {
        description: "Please check your email for the verification link."
      });
      return true;
    } catch (error) {
      console.error('Resend confirmation error:', error);
      toast.error("Resend failed", {
        description: "An unexpected error occurred. Please try again."
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        isAuthenticated, 
        isLoading,
        login, 
        logout, 
        register,
        updateUser,
        resetPassword,
        resendConfirmation
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};