# Calcul Plancher

Application web installable sur iPhone pour calculer les planches de plancher de wagon.

## Règles de calcul

- Planches disponibles : 240 mm, 210 mm, 170 mm
- La largeur saisie est une limite maximale
- Le cumul des planches ne doit jamais dépasser la largeur saisie
- Écart idéal : 5 mm
- Écart maximum : 40 mm pour 3000 mm de plancher cumulé
- Écart max calculé : largeur × 40 / 3000
- Si aucune combinaison n'est conforme, l'application affiche un message d'erreur

## Exemples

Pour 3000 mm :
- écart max autorisé : 40 mm

Pour 744 mm :
- écart max autorisé : 9,9 mm
- 720 mm laisse 24 mm d'écart, donc ce n'est pas conforme
