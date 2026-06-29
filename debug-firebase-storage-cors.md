# Debug Session: firebase-storage-cors
- **Status**: [OPEN]
- **Issue**: L'ajout produit reste bloque sur `ENREGISTREMENT...` et l'upload Firebase Storage echoue avec une erreur CORS/preflight.
- **Debug Server**: http://127.0.0.1:7777/event
- **Log File**: .dbg/trae-debug-log-firebase-storage-cors.ndjson

## Reproduction Steps
1. Ouvrir `/admin/products/new`
2. Ajouter une image
3. Soumettre le formulaire
4. Observer l'echec Firebase Storage et l'absence de produit cree

## Hypotheses & Verification
| ID | Hypothesis | Likelihood | Effort | Evidence |
|----|------------|------------|--------|----------|
| A | L'URL/bucket Firebase Storage est invalide ou mal resolue cote client | High | Low | Suspect |
| B | La requete d'upload echoue avant Firestore et le front ne remonte pas correctement l'erreur | High | Low | Confirmed |
| C | La configuration CORS ou les regles Storage du bucket bloquent le preflight OPTIONS depuis `localhost:3000` | High | Medium | Confirmed |
| D | Le flux `handleSave` reste bloque sur un chemin async sans sortie visible apres echec upload | Medium | Low | Pending |
| E | Le nom/chemin d'objet construit pour Storage declenche un rejet specifique du bucket | Low | Low | Rejected |

## Log Evidence
Instrumentation added in:
- `src/app/admin/products/new/page.tsx`
- `src/lib/firebase/products.ts`

Observed runtime evidence:
- Browser console shows `uploadBytes` failing in `src/lib/firebase/products.ts`
- Browser preflight error: `Response to preflight request doesn't pass access control check`
- Direct `OPTIONS` probe on `https://firebasestorage.googleapis.com/v0/b/chrono-e0636.firebasestorage.app/...` returns `404`
- Direct `OPTIONS` probe on `https://firebasestorage.googleapis.com/v0/b/chrono-e0636.appspot.com/...` also returns `404`

## Verification Conclusion
Current evidence indicates the upload failure happens before Firestore creation and is tied to Firebase Storage preflight/bucket accessibility rather than the file path itself.
