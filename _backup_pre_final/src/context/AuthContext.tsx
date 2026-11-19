import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from "firebase/auth";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../firebase";
import type { UserProfile } from "../types";

// Bentuk data autentikasi yang tersedia untuk seluruh aplikasi
interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

// Membuat context autentikasi
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider untuk membagikan data autentikasi
export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Mengambil profil pengguna dari Firestore
  const refreshUserProfile = async () => {
    if (!auth.currentUser) {
      setUserProfile(null);
      return;
    }

    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setUserProfile(userSnap.data() as UserProfile);
    } else {
      setUserProfile(null);
    }
  };

  // Membuat akun pengguna baru
  const register = async (
    fullName: string,
    email: string,
    password: string
  ) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(credential.user, {
      displayName: fullName,
    });

    const profile: UserProfile = {
      uid: credential.user.uid,
      fullName,
      email,
      role: "user",
      createdAt: new Date(),
    };

    await setDoc(doc(db, "users", credential.user.uid), {
      ...profile,
      createdAt: serverTimestamp(),
    });

    setCurrentUser(credential.user);
    setUserProfile(profile);
  };

  // Login menggunakan email dan password
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Logout pengguna
  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
  };

  // Memantau perubahan status login Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUserProfile(userSnap.data() as UserProfile);
          } else {
            setUserProfile(null);
          }
        } catch (error) {
          console.error("Gagal mengambil profil:", error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Memeriksa role admin dari profil Firestore
  const isAdmin = userProfile?.role === "admin";

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    isAdmin,
    login,
    register,
    logout,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook untuk menggunakan autentikasi
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  }

  return context;
}