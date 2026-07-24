# Graph Report - C:\Users\STE0059945\Documents\Coding\Output  (2026-07-22)

## Corpus Check
- 11 files · ~334,695 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 99 nodes · 163 edges · 15 communities detected
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
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
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]

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
- `_finishSearch()` --calls--> `_`  [INFERRED]
  C:\Users\STE0059945\Documents\Coding\Output\ctags-p6.2.20260705.0-x64\docs\_static\searchtools.js → C:\Users\STE0059945\Documents\Coding\Output\ctags-p6.2.20260705.0-x64\docs\_static\doctools.js

## Communities

### Community 0 - "Community 0"

Cohesion: 0.12
Nodes (9): _, BLACKLISTED_KEY_CONTROL_ELEMENTS, Documentation, _displayItem(), _displayNextItem(), _escapeHTML(), _finishSearch(), Search (+1 more)

### Community 1 - "Community 1"

Cohesion: 0.18
Nodes (17): calculerPlanningAvecPauses(), calculerPlanningTournee(), creerRegistreOccupation(), enregistrerOccupation(), estJour(), estNuit(), getTempsDecharge(), heureVersMinutes() (+9 more)

### Community 2 - "Community 2"

Cohesion: 0.22
Nodes (8): r_R1(), r_R2(), r_shortv(), r_Step_1b(), r_Step_2(), r_Step_3(), r_Step_4(), r_Step_5()

### Community 3 - "Community 3"

Cohesion: 0.29
Nodes (5): ecrireOnglet(), FILE_EXCEL, path, sauvegarderPlan(), xlsx

### Community 4 - "Community 4"

Cohesion: 0.4
Nodes (6): lireChargements(), lireDistancier(), lireOffsets(), lireReglesDech(), validerRegleR9(), verifierR9Journee()

### Community 5 - "Community 5"

Cohesion: 0.33
Nodes (5): app, code, express, path, PORT

### Community 6 - "Community 6"

Cohesion: 0.5
Nodes (5): calculerKPICoutParUT(), calculerKPIJour(), chargerDonnees(), diagnosticComplet(), ouvrirClasseur()

### Community 7 - "Community 7"

Cohesion: 0.4
Nodes (1): stopwords

### Community 8 - "Community 8"

Cohesion: 0.5
Nodes (4): _highlight(), _highlightText(), SPHINX_HIGHLIGHT_ENABLED, SphinxHighlight

### Community 9 - "Community 9"

Cohesion: 0.67
Nodes (4): chargerCreneauxMagasins(), chargerDistancier(), lireOngletBrut(), validerTourneeDepuisUI()

### Community 10 - "Community 10"

Cohesion: 0.67
Nodes (3): lireTournees(), validerRepriseEmballages(), verifierRepriseEmballagesJour()

### Community 11 - "Community 11"

Cohesion: 1.0
Nodes (1): DOCUMENTATION_OPTIONS

### Community 12 - "Community 12"

Cohesion: 1.0
Nodes (0): 

### Community 13 - "Community 13"

Cohesion: 1.0
Nodes (0): 

### Community 14 - "Community 14"

Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **15 isolated node(s):** `xlsx`, `path`, `FILE_EXCEL`, `express`, `path` (+10 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 11`** (2 nodes): `documentation_options.js`, `DOCUMENTATION_OPTIONS`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (2 nodes): `sidebar.js`, `initialiseSidebar()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 13`** (1 nodes): `searchindex.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 14`** (1 nodes): `base-stemmer.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.