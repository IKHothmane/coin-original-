# Debug Session: admin-order-realtime

Status: OPEN

## Symptom
- Une commande est créée depuis le site `ma-boutique`.
- Dans l'application mobile admin, rien ne s'affiche dans `Commandes` et aucune notification temps réel visible.

## Expected
- La commande doit apparaître dans l'écran admin `Commandes`.
- Une notification locale/in-app doit être générée pour l'admin connecté.

## Hypotheses
- H1: l'application mobile n'active jamais l'écoute temps réel admin car `auth.isAdmin` reste faux.
- H2: l'écoute Firestore reçoit bien des snapshots mais échoue au parsing d'un document créé par le site.
- H3: les snapshots Firestore arrivent, mais `OrderProvider` / `NotificationsProvider` ne mettent pas l'UI à jour.
- H4: la commande est créée dans Firestore avec un format valide mais dans un autre projet / autre environnement que celui du mobile.
- H5: la notification locale est prête, mais seule la partie `Commandes` échoue ou n'est pas ouverte avec un compte admin.

## Plan
1. Instrumenter le bootstrap admin et les listeners temps réel.
2. Reproduire une commande depuis le site.
3. Lire les logs pour confirmer/rejeter les hypothèses.
4. Corriger au plus petit scope.
5. Vérifier avec logs post-fix.
