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

// Daftar email yang memiliki hak akses sebagai Administrator Sistem EventKu
export const ADMIN_EMAILS = [
  "admin@eventku.id",
  "admin.utama@eventku.ac.id",
  "admin@eventku.ac.id",
  "admin@admin.com",
  "admin.eventku@gmail.com",
  "admin2026@eventku.ac.id",
  "admin@campus.edu",
  "admin@eventku.com",
];

// Helper untuk memeriksa apakah email terdaftar sebagai admin sistem
export const isSystemAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return (
    ADMIN_EMAILS.includes(normalized) ||
    normalized.startsWith("admin@") ||
    normalized.startsWith("admin.")
  );
};

// Bentuk data autentikasi yang tersedia untuk seluruh aplikasi
interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<UserProfile | null>;
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

    const isAdminUser = isSystemAdminEmail(auth.currentUser.email);

    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        setUserProfile({
          ...data,
          role: isAdminUser ? "admin" : (data.role || "user"),
        });
        return;
      }
    } catch (err) {
      console.warn("refreshUserProfile error:", err);
    }

    setUserProfile({
      uid: auth.currentUser.uid,
      fullName:
        auth.currentUser.displayName ||
        (isAdminUser ? "Administrator EventKu" : "Pengguna"),
      email: auth.currentUser.email || "",
      role: isAdminUser ? "admin" : "user",
      createdAt: new Date(),
      studentId: isAdminUser ? "ADM-001" : "",
      faculty: isAdminUser ? "Biro Kemahasiswaan & Admin" : "",
    });
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

    const isAdminUser = isSystemAdminEmail(email);

    const profile: UserProfile = {
      uid: credential.user.uid,
      fullName,
      email,
      role: isAdminUser ? "admin" : "user",
      createdAt: new Date(),
    };

    try {
      await setDoc(doc(db, "users", credential.user.uid), {
        ...profile,
        role: "user", // Sesuai aturan Firestore rules
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn("Gagal menyimpan profil registrasi ke Firestore:", err);
    }

    setCurrentUser(credential.user);
    setUserProfile(profile);
  };

  // Login menggunakan email dan password
  const login = async (
    email: string,
    password: string
  ): Promise<UserProfile | null> => {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    setCurrentUser(credential.user);

    const isAdminUser = isSystemAdminEmail(credential.user.email);

    try {
      const userRef = doc(db, "users", credential.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        const profile: UserProfile = {
          ...data,
          role: isAdminUser ? "admin" : (data.role || "user"),
        };
        setUserProfile(profile);
        return profile;
      }
    } catch (err) {
      console.error("Gagal mengambil profil setelah login:", err);
    }

    const fallbackProfile: UserProfile = {
      uid: credential.user.uid,
      fullName:
        credential.user.displayName ||
        (isAdminUser ? "Administrator EventKu" : "Pengguna"),
      email: credential.user.email || email,
      role: isAdminUser ? "admin" : "user",
      createdAt: new Date(),
      studentId: isAdminUser ? "ADM-001" : "",
      faculty: isAdminUser ? "Biro Kemahasiswaan & Admin" : "",
    };
    setUserProfile(fallbackProfile);
    return fallbackProfile;
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
        const isAdminUser = isSystemAdminEmail(user.email);
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data() as UserProfile;
            setUserProfile({
              ...data,
              role: isAdminUser ? "admin" : (data.role || "user"),
            });
          } else {
            setUserProfile({
              uid: user.uid,
              fullName:
                user.displayName ||
                (isAdminUser ? "Administrator EventKu" : "Pengguna"),
              email: user.email || "",
              role: isAdminUser ? "admin" : "user",
              createdAt: new Date(),
              studentId: isAdminUser ? "ADM-001" : "",
              faculty: isAdminUser ? "Biro Kemahasiswaan & Admin" : "",
            });
          }
        } catch (error) {
          console.error("Gagal mengambil profil:", error);
          setUserProfile({
            uid: user.uid,
            fullName:
              user.displayName ||
              (isAdminUser ? "Administrator EventKu" : "Pengguna"),
            email: user.email || "",
            role: isAdminUser ? "admin" : "user",
            createdAt: new Date(),
            studentId: isAdminUser ? "ADM-001" : "",
            faculty: isAdminUser ? "Biro Kemahasiswaan & Admin" : "",
          });
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Memeriksa role admin (baik dari database Firestore maupun sistem admin email)
  const isAdmin =
    userProfile?.role === "admin" || isSystemAdminEmail(currentUser?.email);

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


