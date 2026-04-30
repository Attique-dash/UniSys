// app/contexts/authContext.tsx
"use client";
import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { auth, db } from "@/app/firebase/firebase";

export interface AppUser {
  uid: string;
  email: string | null;
  role: "admin" | "teacher" | "cr" | "student" | null;
  name?: string;
  subject?: string;
}

interface AuthContextType {
  currentUser: AppUser | null;
  userLoggedIn: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (firebaseUser: User): Promise<AppUser | null> => {
    try {
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: data.role ?? "student",
          name: data.name,
          subject: data.subject,
        };
      }
      // Check by email for existing users
      const usersSnap = await getDocs(collection(db, "users"));
      const userByEmail = usersSnap.docs.find(doc => doc.data().email === firebaseUser.email);
      if (userByEmail) {
        const data = userByEmail.data();
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: data.role ?? "student",
          name: data.name,
          subject: data.subject,
        };
      }
      // Default for admin accounts
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        role: "admin",
        name: firebaseUser.email?.split('@')[0] || "Admin",
      };
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const refreshUser = async () => {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      const userData = await fetchUserData(firebaseUser);
      setCurrentUser(userData);
    } else {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const userData = await fetchUserData(firebaseUser);
        setCurrentUser(userData);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userLoggedIn: !!currentUser, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};