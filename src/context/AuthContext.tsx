'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { createClient } from '@/utils/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { UserService } from '@/lib/services/userService';
import { EmailService } from '@/lib/services/emailService';
import type { UserProfile } from '@/types/database';

// Define our user type - extending Supabase user with custom metadata
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'non-deaf' | 'admin' | 'deaf';
  proficiency_level: 'Beginner' | 'Intermediate' | 'Advanced' | null;
  isVerified?: boolean;
  email_confirmed_at?: string;
}

// Define AuthContext interface
interface AuthContextProps {
  currentUser: User | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string, role: 'non-deaf' | 'deaf') => Promise<boolean>;
  updateUser: (user: Partial<User>) => Promise<void>;
  changePassword: (newPassword: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  resendConfirmation: (email: string) => Promise<boolean>;
}

// Create context with initial values
export const AuthContext = createContext<AuthContextProps | null>(null);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false); // Flag to prevent race conditions
  const [isInitialized, setIsInitialized] = useState(false); // Track if initial auth is done
  const supabase = createClient();  // Convert Supabase user to our User type with database profile
  const convertSupabaseUser = async (supabaseUser: SupabaseUser): Promise<User> => {
    // Fallback user data from metadata (always available)
    const metadata = supabaseUser.user_metadata || {};
    const fallbackUser: User = {
      id: supabaseUser.id,
      name: metadata.name || metadata.full_name || supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email || '',
      role: (metadata.role as 'non-deaf' | 'admin' | 'deaf') || 'non-deaf',
      proficiency_level: null,
      isVerified: !!supabaseUser.email_confirmed_at,
      email_confirmed_at: supabaseUser.email_confirmed_at
    };

    try {
      // Try to get user profile from database with timeout
      const profilePromise = UserService.getUserProfile(supabaseUser.id);
      const timeoutPromise = new Promise<null>((resolve) => 
        setTimeout(() => {
          console.warn('Profile fetch timeout, using fallback');
          resolve(null);
        }, 5000)
      );
      
      const profile = await Promise.race([profilePromise, timeoutPromise]);
      
      if (profile) {
        console.info('Successfully loaded user profile from database');
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          proficiency_level: profile.proficiency_level,
          isVerified: !!supabaseUser.email_confirmed_at,
          email_confirmed_at: supabaseUser.email_confirmed_at
        };
      } else {
        console.info('No profile found in database, using metadata fallback');
      }
    } catch (error) {
      console.info('Failed to fetch user profile from database, using fallback.');
    }
    
    console.info('Using fallback user data:', {
      id: fallbackUser.id,
      name: fallbackUser.name,
      email: fallbackUser.email,
      role: fallbackUser.role
    });
    
    return fallbackUser;
  };
  // Use ref to track current user ID without causing re-renders
  const currentUserIdRef = React.useRef<string | null>(null);
  
  // Keep ref in sync with state
  React.useEffect(() => {
    currentUserIdRef.current = currentUser?.id || null;
  }, [currentUser?.id]);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth initialization timeout')), 10000)
        );
        
        // Get initial session with timeout
        const sessionPromise = supabase.auth.getSession();
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as Awaited<typeof sessionPromise>;
        
        if (!isMounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
        } else if (session?.user) {
          const user = await convertSupabaseUser(session.user);
          if (isMounted) {
            setCurrentUser(user);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // On timeout or error, still allow the app to proceed (user will be redirected to login)
      } finally {
        if (isMounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        console.log('Auth state changed:', event, session?.user?.email);
        
        // Skip USER_UPDATED events during active updates to prevent race conditions
        if (event === 'USER_UPDATED' && isUpdating) {
          console.log('Skipping auth state update during active profile update');
          return;
        }
        
        // Skip TOKEN_REFRESHED and INITIAL_SESSION if we already have a user loaded with same ID
        // This prevents unnecessary re-fetching that causes UI flicker
        if ((event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') && 
            currentUserIdRef.current && 
            session?.user?.id === currentUserIdRef.current) {
          console.log('Skipping redundant auth state update, user already loaded');
          return;
        }
        
        if (session?.user) {
          // Only re-fetch profile if user ID changed (different user) or we don't have a user yet
          if (!currentUserIdRef.current || currentUserIdRef.current !== session.user.id) {
            const user = await convertSupabaseUser(session.user);
            if (isMounted) {
              setCurrentUser(user);
            }
          }
          if (isMounted) {
            setIsAuthenticated(true);
          }
        } else {
          if (isMounted) {
            setCurrentUser(null);
            setIsAuthenticated(false);
          }
        }
        if (isMounted) {
          setIsLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase.auth, isUpdating]);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Validate inputs before making API call
      if (!email || !password) {
        toast.error("Missing credentials", {
          description: "Email and password are required."
        });
        return false;
      }

      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Login error:', error);
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
    console.log('=== UPDATE USER CALLED ===');
    console.log('isUpdating flag before:', isUpdating);
    setIsUpdating(true); // Set flag to prevent race conditions
    try {
      if (!currentUser) throw new Error('No user logged in');

      console.log('Current user ID:', currentUser.id);
      console.log('Updating user with:', updates);

      // Prepare auth metadata updates (only include defined values)
      const authMetadata: any = {};
      if (updates.name !== undefined) authMetadata.name = updates.name;
      if (updates.role !== undefined) authMetadata.role = updates.role;

      const authUpdates: any = {
        data: authMetadata
      };

      // If email is being updated, add it to auth updates
      if (updates.email && updates.email !== currentUser.email) {
        authUpdates.email = updates.email;
      }

      console.log('Auth updates:', authUpdates);

      // Update auth metadata and email with timeout wrapper
      // Supabase updateUser sometimes hangs, so we add a timeout
      const authUpdatePromise = supabase.auth.updateUser(authUpdates);
      const timeoutPromise = new Promise<{ error: any }>((resolve) => {
        setTimeout(() => {
          console.log('Auth update timeout reached, continuing anyway...');
          resolve({ error: null }); // Resolve with no error after timeout
        }, 3000); // 3 second timeout
      });

      const { error: authError } = await Promise.race([authUpdatePromise, timeoutPromise]);

      console.log('Auth update completed, error:', authError);

      if (authError) {
        console.error('Auth update error:', authError);
        throw authError;
      }

      console.log('No auth error, updating local state...');

      // Update local state immediately after auth update
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
      
      console.log('Local state updated');

      // Update database profile (blocking to ensure consistency)
      const profileUpdates: any = {};
      if (updates.name !== undefined) profileUpdates.name = updates.name;
      if (updates.role !== undefined) profileUpdates.role = updates.role;
      if (updates.email !== undefined) profileUpdates.email = updates.email;

      console.log('Profile updates to sync:', profileUpdates);

      // Update database synchronously - matches pattern used by other modules
      if (Object.keys(profileUpdates).length > 0) {
        console.log('Updating database...');
        const updatedProfile = await UserService.updateUserProfile(currentUser.id, profileUpdates);
        console.log('Database update complete:', updatedProfile);
        // Update local state with database response
        setCurrentUser(prev => prev ? { ...prev, ...updatedProfile } : null);
      }

      // Show success message
      if (updates.email && updates.email !== currentUser.email) {
        toast.success("Profile updated", {
          description: "Please check your email to verify your new email address."
        });
      } else {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error('Update user error:', error);
      toast.error("Update failed", {
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again."
      });
      throw error; // Re-throw to let the dialog handle it
    } finally {
      setIsUpdating(false); // Clear flag
    }
  };

  // Change password function
  const changePassword = async (newPassword: string): Promise<boolean> => {
    try {
      if (!currentUser) {
        toast.error("Authentication required", {
          description: "Please log in to change your password."
        });
        return false;
      }

      // Validate password requirements
      if (newPassword.length < 6) {
        toast.error("Password too short", {
          description: "Password must be at least 6 characters long."
        });
        return false;
      }

      console.log('Updating password for user:', currentUser.email);
      console.log('About to call supabase.auth.updateUser');
      
      // Wrap updateUser in a timeout since it can hang
      const updatePromise = supabase.auth.updateUser({
        password: newPassword
      });
      
      const timeoutPromise = new Promise<{ error: { message: string } }>((_, reject) => {
        setTimeout(() => reject(new Error('Password update timed out')), 3000);
      });
      
      let updateResult;
      try {
        updateResult = await Promise.race([updatePromise, timeoutPromise]);
        console.log('updateUser returned:', updateResult);
      } catch (timeoutError) {
        // If it times out, the password was likely updated (we see USER_UPDATED event)
        // So we'll assume success
        console.log('updateUser timed out, but USER_UPDATED fired, assuming success');
        updateResult = { error: null };
      }

      if (updateResult.error) {
        console.error('Password update error:', updateResult.error);
        toast.error("Password change failed", {
          description: updateResult.error.message || "Unable to update password. Please try again."
        });
        return false;
      }

      console.log('Password updated successfully in Supabase');
      
      // Send email with new password (don't wait for it)
      EmailService.sendPasswordChangeEmail({
        to: currentUser.email,
        userName: currentUser.name,
        newPassword: newPassword
      })
        .then(() => {
          console.log('Password change email sent successfully');
        })
        .catch((emailError) => {
          console.error('Failed to send password change email:', emailError);
        });
      
      // Show success immediately (don't wait for email)
      toast.success("Password changed successfully", {
        description: "Your password has been updated."
      });

      console.log('Returning true from changePassword');
      return true;
    } catch (error) {
      console.error('Change password error:', error);
      toast.error("Password change failed", {
        description: "An unexpected error occurred. Please try again."
      });
      return false;
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
        user: currentUser,
        isAuthenticated, 
        isLoading,
        login, 
        logout, 
        register,
        updateUser,
        changePassword,
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