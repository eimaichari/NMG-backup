import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,     setUser]     = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading,  setLoading]  = useState(true); // stays true until BOTH auth + Firestore are ready

  const fetchUserData = useCallback(async (firebaseUser) => {
    if (!firebaseUser) { setUserData(null); return null; }
    const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
    const data = snap.exists() ? snap.data() : null;
    setUserData(data);
    return data;
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      await fetchUserData(firebaseUser); // wait for Firestore before clearing loading
      setLoading(false);                 // only NOW is the app ready to make auth decisions
    });
    return unsubscribe;
  }, [fetchUserData]);

  /* ── Sign Up ── */
  const signUp = async ({ fullName, email, password }) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: fullName });
    const profile = {
      fullName,
      email,
      role:          'user',
      agreedToTerms: true,
      createdAt:     serverTimestamp(),
    };
    await setDoc(doc(db, 'users', cred.user.uid), profile);
    setUserData(profile);
    return cred.user;
  };

  /* ── Sign In (email/password) ── */
  const signIn = async ({ email, password }) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const data = await fetchUserData(cred.user);
    // Attach userData to the returned user object so SignInPage can read fullName
    cred.user._userData = data;
    return cred.user;
  };

  /* ── Sign In (Google) ── */
  const signInWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const ref  = doc(db, 'users', cred.user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      const profile = {
        fullName:      cred.user.displayName || '',
        email:         cred.user.email,
        role:          'user',
        agreedToTerms: true,
        createdAt:     serverTimestamp(),
      };
      await setDoc(ref, profile);
      setUserData(profile);
    } else {
      setUserData(snap.data());
    }
    return cred.user;
  };

  /* ── Sign Out ── */
  const logOut = async () => {
    await signOut(auth);
    setUser(null);
    setUserData(null);
  };

  const isAdmin = userData?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, userData, loading, isAdmin, signUp, signIn, signInWithGoogle, logOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
