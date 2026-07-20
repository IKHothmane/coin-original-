import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

function getFirebaseAdminConfig() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "";
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL ?? "";
  const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}

export function isFirebaseAdminConfigured() {
  const config = getFirebaseAdminConfig();
  return Boolean(config.projectId && config.clientEmail && config.privateKey);
}

export function getFirebaseAdminApp() {
  if (getApps().length) {
    return getApps()[0]!;
  }

  const config = getFirebaseAdminConfig();
  if (!config.projectId || !config.clientEmail || !config.privateKey) {
    throw new Error("Firebase Admin config incomplete. Check FIREBASE_ADMIN_* env vars.");
  }

  return initializeApp({
    credential: cert({
      projectId: config.projectId,
      clientEmail: config.clientEmail,
      privateKey: config.privateKey,
    }),
  });
}

export function getFirebaseAdminMessaging() {
  return getMessaging(getFirebaseAdminApp());
}
