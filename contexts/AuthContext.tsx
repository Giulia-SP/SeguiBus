
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In a real app, this would be your user database.
// We'll use localStorage to persist users for the demo.
const getInitialUsers = (): User[] => {
  try {
    const storedUsers = localStorage.getItem('seguibus-users');
    if (storedUsers) {
      return JSON.parse(storedUsers);
    }
  } catch (e) {
    console.error("Failed to parse users from localStorage", e);
  }
  return [{ id: '0', name: 'Admin', email: 'admin@seguibus.com' }];
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(getInitialUsers);

  useEffect(() => {
    try {
      localStorage.setItem('seguibus-users', JSON.stringify(users));
    } catch (e) {
      console.error("Failed to save users to localStorage", e);
    }
  }, [users]);
  

  const login = (email: string, password: string): boolean => {
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    // In a real app, you'd validate hashed credentials. Here we just check if the user exists.
    if (foundUser && password) { 
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = (name: string, email: string, password: string): boolean => {
    const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (userExists) {
      return false; // Can't register, email already in use
    }
    const newUser: User = { id: new Date().toISOString(), name, email };
    setUsers(prevUsers => [...prevUsers, newUser]);
    setUser(newUser);
    return true;
  };
  
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};