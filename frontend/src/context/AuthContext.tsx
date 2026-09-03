import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

export type UserRole = 'ADMIN' | 'USER' | null;

interface AuthContextType {
  currentUser: User | null;
  role: UserRole;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<UserRole>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  role: null,
  isAdmin: false,
  loading: true,
  signInWithGoogle: async () => null,
  logout: async () => {},
});

export const ADMIN_EMAIL = "kathirvelankvr@gmail.com";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  const determineRole = (user: User | null): UserRole => {
    if (!user) return null;
    const email = (user.email || '').toLowerCase().trim();
    if (email === ADMIN_EMAIL.toLowerCase() || email.includes('kathirvelankvr@gmail')) {
      return 'ADMIN';
    }
    return 'USER';
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      const userRole = determineRole(user);
      setRole(userRole);

      if (user) {
        localStorage.setItem('srevia_user_email', user.email || '');
        if (userRole === 'ADMIN') {
          localStorage.setItem('srevia_admin_token', 'firebase_admin_active');
          localStorage.setItem('srevia_admin_email', user.email || ADMIN_EMAIL);
        }
      } else {
        localStorage.removeItem('srevia_admin_token');
        localStorage.removeItem('srevia_admin_email');
        localStorage.removeItem('srevia_user_email');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<UserRole> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setCurrentUser(user);
      const userRole = determineRole(user);
      setRole(userRole);

      if (userRole === 'ADMIN') {
        localStorage.setItem('srevia_admin_token', 'firebase_admin_active');
        localStorage.setItem('srevia_admin_email', user.email || ADMIN_EMAIL);
      } else {
        localStorage.setItem('srevia_user_email', user.email || '');
      }

      return userRole;
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setRole(null);
    localStorage.removeItem('srevia_admin_token');
    localStorage.removeItem('srevia_admin_email');
    localStorage.removeItem('srevia_user_email');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        isAdmin: role === 'ADMIN',
        loading,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
