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

## Evidence
- Logs utilisateur fournis: ouverture de `SignInHubActivity`, warnings Google Play/provider, aucune preuve claire de succes Firebase.
- `android/app/google-services.json` contient uniquement un client OAuth `client_type: 3` et aucun client Android dedie.
- Le package Android configure est `com.coinoriginal.coin_original_mobile`.
- Empreinte debug locale relevee:
  - SHA-1: `3E:AD:13:AE:96:A5:0B:62:C4:F1:DC:7B:58:3A:05:B5:20:57:9E:34`
  - SHA-256: `43:D6:CE:4A:3B:1F:EB:8B:4A:20:B0:E7:E5:50:48:79:8F:D9:F1:BF:85:53:09:06:51:66:64:70:0B:F8:24:6F`
- Instrumentation ajoutee dans `lib/services/auth_service.dart` pour capter l'etape exacte de l'echec lors du prochain test.

## Next Step
- Ajouter les empreintes SHA Android dans Firebase Console, telecharger un nouveau `google-services.json`, puis retester avec l'instrumentation active.
