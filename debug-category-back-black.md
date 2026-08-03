[OPEN]

# Debug Session: category-back-black

## Symptome
- En cliquant sur l'icone retour dans `CategoryScreen`, l'utilisateur voit une page noire.

## Hypotheses
1. Le flux `backToHomeOnExit` reconstruit `MainScreen` via `pushNamedAndRemoveUntil` et un rebuild suivant casse l'affichage du premier frame.
2. Le `Navigator.pop(context)` ou le retour systeme n'utilise pas toujours le bon contexte de navigation selon l'origine de `CategoryScreen`.
3. Un rebuild de `HomeScreen` apres retour lance une exception runtime silencieuse qui se traduit par un ecran noir.
4. Une route modale ou un overlay reste actif pendant le retour et masque l'ecran sous-jacent avec un fond noir.
5. Le probleme ne vient pas de la page categorie elle-meme, mais du route stack genere par l'ouverture depuis l'accueil.

## Plan
- Instrumenter `CategoryScreen`, `HomeScreen` et `MainScreen`.
- Reproduire le clic retour depuis la categorie ouverte depuis l'accueil.
- Comparer les logs pour confirmer le point exact de rupture.
