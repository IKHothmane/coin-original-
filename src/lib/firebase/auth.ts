import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, type User } from "firebase/auth";
import { getFirebaseApp } from "./client";

let _auth: ReturnType<typeof getAuth> | null = null;

export function getFirebaseAuth() {
  if (!_auth) {
    _auth = getAuth(getFirebaseApp());
  }
  return _auth;
}

export async function registerUser(email: string, password: string, displayName: string) {
  const auth = getFirebaseAuth();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName });
  return userCredential.user;
}

export async function loginUser(email: string, password: string) {
  const auth = getFirebaseAuth();
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function logoutUser() {
  const auth = getFirebaseAuth();
  await signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(): User | null {
  const auth = getFirebaseAuth();
  return auth.currentUser;
}
