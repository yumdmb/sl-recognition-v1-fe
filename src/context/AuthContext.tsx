'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// Define our user type
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'deaf';
  isVerified?: boolean;
}

// Define AuthContext interface
interface AuthContextProps {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: 'user' | 'deaf') => Promise<boolean>;
  updateUser: (user: User) => void;
  resetPassword: (email: string) => Promise<boolean>;
}

// Create context with initial values
const AuthContext = createContext<AuthContextProps | null>(null);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize on mount - check if user is saved in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // Check if admin credentials are used
    if (email === 'elvissawing.muran@gmail.com' && password === 'sign123') {
      const adminUser: User = {
        id: 'admin-001',
        name: 'Elvis Sawing',
        email: 'elvissawing.muran@gmail.com',
        password: 'sign123',
        role: 'admin',
        isVerified: true
      };
      
      setCurrentUser(adminUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      return true;
    }

    // For other users, check localStorage
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users: User[] = JSON.parse(storedUsers);
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        // Check if user is verified
        if (foundUser.isVerified === true) {
          setCurrentUser(foundUser);
          setIsAuthenticated(true);
          localStorage.setItem('currentUser', JSON.stringify(foundUser));
          return true;
        } else {
          toast.error("Account not verified", {
            description: "Your account is pending verification by an administrator. Please try again later."
          });
          return false;
        }
      }
    }
    
    // Login failed
    toast.error("Login failed", {
      description: "Invalid email or password. Please try again."
    });
    return false;
  };

  // Register function
  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: 'user' | 'deaf'
  ): Promise<boolean> => {
    // Check if email already exists
    const storedUsers = localStorage.getItem('users');
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
    
    if (users.some(u => u.email === email)) {
      toast.error("Registration failed", {
        description: "Email is already in use. Please try a different email."
      });
      return false;
    }
    
    // Create new user (default to not verified)
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role,
      isVerified: false
    };
    
    // Save user to localStorage
    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    
    // Notify user that verification is required
    toast.success("Registration successful", {
      description: "Your account has been created but requires verification by an administrator before you can log in."
    });
    
    return true;
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  // Update user information
  const updateUser = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Also update in users array
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users: User[] = JSON.parse(storedUsers);
      const updatedUsers = users.map(u => u.id === user.id ? user : u);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<boolean> => {
    // Check if email exists
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const users: User[] = JSON.parse(storedUsers);
      const userExists = users.some(u => u.email === email);
      
      // In a real app, we would send an email here
      // For this demo, we'll just return whether the user exists
      return userExists;
    }
    
    return false;
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        isAuthenticated, 
        login, 
        logout, 
        register,
        updateUser,
        resetPassword
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