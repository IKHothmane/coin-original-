# Debug Session: google-signup-fail

Status: OPEN

## Symptom
- "S'inscrire avec Google" ne fonctionne pas sur l'application mobile Android.

## Expected
- L'utilisateur choisit un compte Google, puis la connexion Firebase réussit et redirige vers l'accueil ou l'admin.

## Initial Hypotheses
- H1: La configuration Firebase Android / Google Sign-In est incomplète ou obsolète.
- H2: `signInWithGoogle()` echoue pendant l'echange credential Google -> Firebase.
- H3: Le token/client Google requis n'est pas correct pour Android.
- H4: La connexion reussit mais une erreur survient ensuite pendant la recuperation/creation du profil utilisateur.

## Status
- **Web (admin `/login`)** : corrigé — le bouton Google n'avait aucun handler ni appel Firebase.
- **Mobile (Android)** : corrigé — `GoogleSignIn` utilisait le client par défaut sans `serverClientId` (Web Client ID), donc pas d'ID Token pour Firebase.

## Evidence
- `login/page.tsx` : bouton « Continuer avec Google » sans `onClick` ni `loginWithGoogle()`.
- `auth_service.dart` : `GoogleSignIn()` sans `serverClientId` → erreur « ID Token manquant » probable sur Android.
- `google-services.json` : SHA-1 debug déjà présent (`3ead13ae...`).

## Next Step
- Activer le fournisseur **Google** dans Firebase Console → Authentication → Sign-in method.
- Retester connexion Google sur web et mobile.
