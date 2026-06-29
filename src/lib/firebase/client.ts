import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC0LkslDmJrhJT8FJC64R9NxAG2nvNIZPI",
  authDomain: "chrono-e0636.firebaseapp.com",
  projectId: "chrono-e0636",
  storageBucket: "chrono-e0636.firebasestorage.app",
  messagingSenderId: "161781855982",
  appId: "1:161781855982:web:0aa6d4534e84c9602765ff",
  measurementId: "G-NJJFM02GMH",
};

export function isFirebaseConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

export function getFirebaseApp() {
  if (!getApps().length) {
    return initializeApp(firebaseConfig);
  }

  return getApp();
}

export const firebaseApp = getFirebaseApp();
export const firebaseDb = getFirestore(firebaseApp);
