'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User } from '@/lib/types';
import {
  getCurrentUser,
  setCurrentUser,
  getUsers,
  createUser,
  updateUser as storageUpdateUser,
} from '@/lib/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (
    email: string,
    nickname: string,
    password: string
  ) => { success: boolean; error?: string };
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  const login = (email: string, password: string): boolean => {
    const found = getUsers().find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      setCurrentUser(found);
      setUser(found);
      return true;
    }
    return false;
  };

  const signup = (email: string, nickname: string, password: string) => {
    const users = getUsers();
    if (users.find((u) => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }
    if (
      users.find(
        (u) => u.nickname.toLowerCase() === nickname.toLowerCase()
      )
    ) {
      return { success: false, error: 'Nickname already taken' };
    }
    const newUser = createUser(email, nickname, password);
    setCurrentUser(newUser);
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setUser(null);
  };

  const updateUser = (updated: User) => {
    storageUpdateUser(updated);
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
