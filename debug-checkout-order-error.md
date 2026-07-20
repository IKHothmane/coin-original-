# Debug Session: checkout-order-error

- Status: OPEN
- Symptom: le checkout affiche `Erreur creation commande.`
- Surface: `src/components/checkout-page.tsx` lors du clic sur `Confirmer - Je paye a la livraison`
- Goal: identifier pourquoi `createOrder()` retourne `result.data = null`

## Hypotheses

1. `createOrder()` recoit une erreur du repository Firestore et retourne `{ data: null, error }`.
2. Le repository des commandes n'est pas correctement initialise dans l'environnement client.
3. Les donnees envoyees au repository contiennent un champ invalide ou vide qui fait echouer l'ecriture.
4. Le projet Firebase courant refuse l'ecriture a cause des regles Firestore ou d'une mauvaise config runtime.
5. Une exception est attrapee trop haut dans la pile et masque l'erreur exacte, ce qui ne laisse que `Erreur creation commande.`

## Evidence Log

- Pre-fix:
  - `checkout submit start` capture bien le submit checkout.
  - `firebase order create start` confirme que Firebase est configure.
  - `firebase order create error` retourne: `Unsupported field value: undefined (found in field customer.email ...)`.
  - `checkout createOrder result` montre `hasData: false` et reprend la meme erreur.
- Post-fix:
  - `checkout submit start` capture bien le nouveau submit.
  - `firebase order create error` retourne maintenant: `Missing or insufficient permissions.`
  - Le fichier `firestore.rules` n'autorisait que `/products/{productId}` et pas `/orders/{orderId}`.

## Hypothesis Status

1. `createOrder()` recoit une erreur du repository Firestore et retourne `{ data: null, error }`. -> CONFIRMEE
2. Le repository des commandes n'est pas correctement initialise dans l'environnement client. -> REJETEE
3. Les donnees envoyees au repository contiennent un champ invalide ou vide qui fait echouer l'ecriture. -> CONFIRMEE (`customer.email = undefined`)
4. Le projet Firebase courant refuse l'ecriture a cause des regles Firestore ou d'une mauvaise config runtime. -> CONFIRMEE
5. Une exception est attrapee trop haut dans la pile et masque l'erreur exacte, ce qui ne laisse que `Erreur creation commande.` -> PARTIELLEMENT CONFIRMEE

## Next Step

- Deployer la regle Firestore mise a jour pour autoriser `/orders/{orderId}`, puis refaire un test post-fix.
