# Graph Report - C:\Users\STE0059945\Documents\Coding\Output\code  (2026-07-22)

## Corpus Check
- 2 files · ~53,734 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 49 nodes · 108 edges · 8 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]

## God Nodes (most connected - your core abstractions)
1. `validerTournee()` - 12 edges
2. `lireOngletBrut()` - 11 edges
3. `ouvrirClasseur()` - 9 edges
4. `verifierR9Journee()` - 9 edges
5. `heureVersMinutes()` - 7 edges
6. `calculerPlanningTournee()` - 6 edges
7. `minutesVersHeure()` - 5 edges
8. `calculerPlanningAvecPauses()` - 5 edges
9. `validerLivraisonFraisNuit()` - 5 edges
10. `validerRegleR9()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `verifierR9Journee()` --calls--> `ouvrirClasseur()`  [EXTRACTED]
  C:\Users\STE0059945\Documents\Coding\Output\code\code.js → C:\Users\STE0059945\Documents\Coding\Output\code\code.js  _Bridges community 1 → community 0_
- `validerTourneeDepuisUI()` --calls--> `ouvrirClasseur()`  [EXTRACTED]
  C:\Users\STE0059945\Documents\Coding\Output\code\code.js → C:\Users\STE0059945\Documents\Coding\Output\code\code.js  _Bridges community 1 → community 6_
- `chargerDistancier()` --calls--> `lireOngletBrut()`  [EXTRACTED]
  C:\Users\STE0059945\Documents\Coding\Output\code\code.js → C:\Users\STE0059945\Documents\Coding\Output\code\code.js  _Bridges community 0 → community 6_
- `calculerPlanningAvecPauses()` --calls--> `heureVersMinutes()`  [EXTRACTED]
  C:\Users\STE0059945\Documents\Coding\Output\code\code.js → C:\Users\STE0059945\Documents\Coding\Output\code\code.js  _Bridges community 2 → community 7_
- `calculerPlanningTournee()` --calls--> `heureVersMinutes()`  [EXTRACTED]
  C:\Users\STE0059945\Documents\Coding\Output\code\code.js → C:\Users\STE0059945\Documents\Coding\Output\code\code.js  _Bridges community 2 → community 0_

## Communities

### Community 0 - "Community 0"

Cohesion: 0.29
Nodes (12): calculerPlanningTournee(), lireChargements(), lireDistancier(), lireOffsets(), lireOngletBrut(), lireReglesDech(), lireTournees(), minutesVersHeure() (+4 more)

### Community 1 - "Community 1"

Cohesion: 0.33
Nodes (7): calculerKPICoutParUT(), calculerKPIJour(), chargerDonnees(), diagnosticComplet(), ecrireOnglet(), ouvrirClasseur(), sauvegarderPlan()

### Community 2 - "Community 2"

Cohesion: 0.38
Nodes (7): estJour(), estNuit(), heureVersMinutes(), validerContraintesChargement(), validerContraintesLivraison(), validerLivraisonFraisNuit(), validerTourneeRegleR9()

### Community 3 - "Community 3"

Cohesion: 0.33
Nodes (3): FILE_EXCEL, path, xlsx

### Community 4 - "Community 4"

Cohesion: 0.33
Nodes (6): creerRegistreOccupation(), enregistrerOccupation(), magasinDisponible(), validerCapaciteRemorque(), validerCompatibiliteMarchandises(), validerTournee()

### Community 5 - "Community 5"

Cohesion: 0.33
Nodes (5): app, code, express, path, PORT

### Community 6 - "Community 6"

Cohesion: 0.67
Nodes (3): chargerCreneauxMagasins(), chargerDistancier(), validerTourneeDepuisUI()

### Community 7 - "Community 7"

Cohesion: 1.0
Nodes (2): calculerPlanningAvecPauses(), getTempsDecharge()

## Knowledge Gaps
- **8 isolated node(s):** `xlsx`, `path`, `FILE_EXCEL`, `express`, `path` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 7`** (2 nodes): `calculerPlanningAvecPauses()`, `getTempsDecharge()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.