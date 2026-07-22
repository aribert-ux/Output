# Auchan Transport — Outil de Planification V7 — Progression

---

## 0) Contexte métier

**Entreprise :** Auchan, région Nord de la France.
**Activité :** Planification quotidienne des livraisons depuis les entrepôts régionaux vers le réseau de magasins (hypermarchés, supermarchés).

**Objectif stratégique :** Minimiser le **coût moyen par UT livrée** (`coût total journée / UT livrées`), en arbitrant en permanence entre la flotte propre (moins chère) et l'affrètement externe (sollicité en cas de saturation ou d'impossibilité horaire).

**Entités clés :**

| Entité | Description |
|---|---|
| UT (Unité de Transport) | Palette — unité de base du flux |
| Module | Ensemble {Tracteur + Chauffeur} — coût calculé par formule trinôme |
| Remorque | Contenant tracté, capacité ≤ 33 UT, spécialisée sec / frais / surgelé |
| Entrepôt | Point de départ, spécialisé par type de marchandise |
| Magasin | Point de livraison, avec créneaux horaires propres |
| Affrètement | Transporteur externe, sollicité si flotte saturée ou contrainte intenable |

**Types de marchandises :**

| Code | Famille | Contraintes notables |
|---|---|---|
| PGC | Produits Grande Conso | Chargement de jour uniquement (R3) |
| NAL | Non-Alimentaire | Chargement de jour uniquement (R3) |
| BSA | Bazar/Saisonnier/Auto | Chargement de jour uniquement (R3) |
| FL | Fruits & Légumes | Remorque frais (2–8 °C) |
| PF | Produits Frais | Remorque frais (2–8 °C) |
| SURG | Surgelés | Remorque surgelés (−18 °C) |

**Problème en deux étapes :**
1. **Chargement remorque** — grouper des UT compatibles dans une remorque (tournée)
2. **Organisation module** — affecter une ou plusieurs remorques à un module, planifier l'itinéraire et les pauses

---

## a) Plan de travail général

Migrer l'outil de planification de tournées Auchan depuis **Google Apps Script** vers une solution autonome lisible depuis un fichier Excel local, sans installation logicielle (Node.js bloqué par l'administrateur).

**Architecture retenue :**
- Le fichier Excel (`Fleet V7.1.xlsx`) est la **source de données en lecture seule** (flux, tournées, distancier, créneaux…)
- Les affectations flux→tournée sont stockées dans **`AppState.planLocal`** (mémoire navigateur)
- L'export/import de session se fait via des **fichiers JSON** (pas d'écriture dans le .xlsx)
- Aucun serveur requis — 100% navigateur via SheetJS CDN + FileReader API

**Fichiers du projet :**

| Fichier | Rôle |
|---|---|
| `Fleet V7.1.xlsx` | Source de données (13 onglets, lecture seule) |
| `outil_v7.html` | Interface utilisateur (Gantt, validation, KPI, export/import) |
| `code.js` | Backend Node.js adapté (utilisable si Node.js disponible un jour) |
| `server.js` | Serveur Express local (utilisable si Node.js disponible) |
| `session_transport_*.json` | Sessions exportées (plan du jour, flux affectés) |

---

## b) Mise en œuvre par étapes

### Étape 1 — Analyse et migration GAS → Node.js ✅
- Analysé `code.js` (15 fonctions GAS, dépendances SpreadsheetApp)
- Remplacé `SpreadsheetApp` par `xlsx.readFile()` + `xlsx.utils.sheet_to_json()`
- Corrigé bug `verifierRepriseEmballagesJour()` (incomplète dans l'original)
- `heureVersMinutes()` étendue : fractions décimales Excel, Date, "HH:MM"

### Étape 2 — Migration 100% navigateur (`outil_v7.html`) ✅
- SheetJS CDN ajouté en `<head>`
- Bouton "📂 Charger Excel" + FileReader API → `AppState.wb`
- Logique métier R1–R11 portée en JavaScript pur
- Polyfill `google.script.run` via Proxy+setTimeout (appels HTML inchangés)

### Étape 3 — Architecture export/import ✅
- **Export** : bouton "💾 Exporter" → `session_transport_<jour>_<date>.json`
- **Import** : bouton "📥 Importer" → restaure `AppState.planLocal` + re-rendu Gantt
- La sauvegarde ne modifie plus le fichier Excel (lecture seule)

### Étape 4 — Corrections Gantt ✅
- Gantt scrollable de 0h à 30h (00h00 J → 06h00 J+1)
- Frais visibles après scroll à droite

### Étape 5 — Corrections R1-R11 et validation ✅
- R1 (capacité) + R2 (compatibilité) vérifiés au dépôt du flux
- R11 local : fusionne Excel + `AppState.planLocal`
- R3 : heure de chargement PGC/NAL/BSA ajustée automatiquement (jour uniquement)

### Étape 6 — Fractions de flux, suppression, pauses, vue magasins ✅
- Fractions de flux : modal UT à affecter (`utAffecte` dans `planLocal`)
- Suppression d'un bloc : bouton ✕ sur chaque bloc livraison du Gantt
- Pauses réglementaires : R6 (45 min / 4h30 conduite) et R7 (30 min / 6h service) insérées automatiquement

### Étape 7 — Refonte toolbar et zoom ✅
- Zoom fonctionnel sur les 3 vues Gantt (25 % à 200 %, 5 crans)
- Filtres déplacés à gauche, actions à droite

### Étape 8 — Nettoyage UI règles R9/R11 ✅
- Boutons R9 et R11 retirés de la toolbar (vérification dans l'onglet Valider uniquement)

### Étape 9 — Corrections détection chevauchement tracteur ✅
- Tri temporel des tournées, prise en compte des `tourneeOverrides`, `lieuDepart` passé à `calculerPlanningGantt`

### Étape 10 — Synchronisation Gantt Magasins ✅
- Même logique que `rendreGantt` : tri par offset, `prevRetour`, `lieuDepart`
- Alignement pixel-parfait entre vue Modules et vue Magasins

### Étape 11 — Drag inter-modules ✅
- Glisser une barre de tournée entre modules dans le Gantt
- Tooltip flottant destination + heure, highlight de la piste cible

### Étape 12 — KPI Trinôme dans l'onglet Valider ✅
- **Formule** : `Coût = A + B-sec×km_sec + B-frais×km_frais + C-jour×h_jour + C-nuit×h_nuit`
- 5 coefficients configurables, taux de remplissage km-pondéré, coût carbone/UT (ADEME)
- Tableau détail par module collapsible

### Étape 13 — Créneaux horaires magasins dans le Gantt Magasins ✅
- Multi-créneaux par magasin/jour, rendu visuel (bandes vertes + fond rouge si fermé)
- Détection de conflit : bloc livraison en rouge si hors créneau

### Étape 14 — Filtres flux multi-sélection ✅
- 4 filtres à cases à cocher (Marchandise, Magasin, Zone, Entrepôt)
- Composant natif CSS+JS, état dans `AppState.filtresFlux`

### Étape 15 — Gantt Magasins : layout CSS Grid ✅
- CSS Grid `86px 54px 1fr` remplace flex pour les groupes magasin
- La 5e sous-ligne du dernier magasin n'est plus tronquée
- Nom magasin : `grid-row: 1 / span N` → s'étend sur toutes les lignes de types

### Étape 16 — Corrections Gantt Remorques ✅
- **Type remorque** : `getTypeTourneeRem(tid)` lit en priorité les flux planifiés (`planLocal`), retourne `'sec'`, `'frais'` ou `'surg'`
- **Distinction frais / surgelé** : deux lignes séparées par module (❄ Frais bleu `#1E88E5` / 🧊 Surgelé bleu foncé `#283593`) au lieu d'une seule ligne "Froid"
- Suppression du fallback erroné sur la colonne zone Excel (qui contenait le code entrepôt, pas le type)

### Étape 17 — Simplification modal "créer tournée" ✅
- Sélecteur de tournées Excel existantes supprimé : seule la création est disponible
- Champs Zone et Retour retirés du formulaire ; defaults : `retour='ENTREPOT'`, `zone='PGC'`
- ID auto-incrémenté `TL01`, `TL02`…

### Étape 18 — Alerte accroche ✅
- Dans `rendreGantt`, si `prevRetourModule ≠ fluxPlanifies[0].entrepot` : segment accrochage en rouge clignotant (`#E53935`, animation `accroche-pulse`)
- Tooltip : `⚠ Accroche à LSQ mais les flux partent de AMS`

### Étape 19 — Suppression règle R9 ✅
- R9 ("frais livraison de nuit uniquement") supprimée : **les produits FL/PF peuvent désormais être livrés à toute heure**
- Retiré de : `calculerPlanningGantt` (saut forcé à 22h), `validerLivraisonFraisNuit`, `validerContraintesLivraison`, modal ajout flux, légende, toast, checklist Valider
- Mention "🌙 Nuit uniquement" retirée des étiquettes de flux dans la colonne gauche

### Étape 20 — Interface délai emballage par arrêt ✅
- Remplace le bouton `EMB OUI/NON` par un sélecteur `—`, `15′`, `30′`, `45′`, `60′` (chips colorés brun)
- Champ `embDelai` (minutes) sur chaque flux dans `planLocal` ; `repriseEmb` maintenu en sync pour R11
- `calculerPlanningGantt` insère un bloc `'emballage'` (brun `#8D6E63`, texte `EMB`) après le déchargement si `embDelai > 0`
- Présent dans le panel tournées et dans le modal détail tournée

### Étape 21 — Barre de composition remorque ✅
- **Gantt Modules** : barre de composition (bas de chaque barre tournée) — couleur par magasin, portion vide en blanc, séparée du bloc par une ligne blanche `2px`
- **Panel tournées** : barre de composition 6px (même code couleur) remplace l'ancienne barre jaune de capacité
- Tooltip global `X / 33 UT — Y% chargé`, tooltip par segment

### Étape 22 — Migration vers les nouveaux fichiers d'entrée (`entrants_final/`) ✅
- **Distancier** (Distancier REFLEX_final.xlsx) : parsé via `parserXlsxDistancier`, persisté en localStorage (`outil_v7_distancier`), restauré automatiquement au démarrage — le bouton "📏 Distancier" permet de changer le fichier ponctuellement.
- **Dépendances supprimées** : le programme ne dépend plus que des onglets `Flux`, `Lieux` et `PlagesOuverture` du fichier Excel principal. Les onglets suivants ne sont plus lus : `Tournées`, `Modules`, `Offsets`, `TempsDecharge`, `OrdreArrêts`, `Chargements`, `Chaines`, `PausesPosees`, `Couts_Modules`, `Affretements`.
- **Tournées entièrement manuelles** : les tournées sont créées dans l'UI (bouton "+") et stockées dans `AppState.tourneesLocales`. Il n'y a pas de tournées pré-chargées.
- **Modules auto-initialisés** : `initModules` crée un module par tournée locale, offset par défaut 6h00. L'utilisateur réorganise ensuite via le Gantt.
- **Fonctions supprimées** : `lireReglesDechWb`, `lireChargementsWb`, `lireTourneesWb`, `lireOffsetsWb`.
- **Corrections Gantt/pauses** : compteur de service compte les blancs inter-tournées ; trajet découpé mid-segment si une limite de pause tombe en route.

### Étape 23 — Gantt hebdomadaire avec contexte inter-jours ✅
- **Convention jour** : chaque journée va de 6h à 6h (J à J+1). `JOURS_SEMAINE` + `getJourPrecedent` / `getJourSuivant` implémentés.
- **Filtrage par jour dans les modules** : quand un jour est sélectionné, seules les tournées de ce jour s'affichent normalement dans chaque module. Les tournées de la veille et du lendemain présentes dans le même module sont séparées dans `toursCtxPrev` / `toursCtxNext`.
- **Zones de contexte visuelles** :
  - `[0h, 6h]` : fond grisé + bordure en pointillés = fin de journée de la veille (blocs de la veille décalés de -24h qui débordent après minuit)
  - `[30h, 34h]` : fond grisé + bordure en pointillés = début de journée du lendemain (blocs du lendemain décalés de +24h)
- **Barres fantômes** (`rendreBlocsCtx`) : les tournées des jours adjacents sont rendues à 45 % d'opacité avec leurs couleurs de segments réelles (trajet, livraison, pause…), clippées à leur zone de contexte. Visible uniquement si un même module contient des tournées de plusieurs jours.
- **Échelle horaire** : timeline étendue à 34h quand un jour est sélectionné. Séparateurs forts (`.jour-sep`) à 6h (début du jour) et 30h (fin du jour). Étiquettes `DIM.` / `MAR.` aux extrémités de la timeline.
- **Drag & drop** : inchangé — le calcul d'offset reste cohérent (le drop est toujours en minutes depuis minuit).

### Étape 24 — Pauses réglementaires : règles d'insertion, repositionnement et visualisation parallèle ✅
- **Règle de découpe** : les pauses dures (hard breaks) ne peuvent couper que des blocs `trajet`/`retour` ; elles sont insérées **avant** un bloc `livraison`/`emballage` si celui-ci est trop court pour absorber la pause en parallèle.
- **Pause parallèle conditionnelle** : `checkParallelBreaks(slotAt, slotDur)` — si `slotDur >= durée_pause` la pause est parallèle (le compteur se réinitialise sans avancer le curseur) ; sinon bascule en hard break après le bloc.
- **Visualisation parallèle** : barre fine de 5 px, couleur `#FF6F00` (orange), positionnée 3 px sous la barre principale du module. Tooltip horodaté. CSS `.pause-parallele-bar`.
- **Repositionnement manuel** : glisser un bloc `⏸` vers la gauche (amont uniquement) réécrit `AppState.pauseOverrides['modId_tid']` ; double-clic pour réinitialiser. Injection dans `calculerPlanningGantt` via le 10e paramètre `manualBreaks`.
- **Coupure de shift** : `AppState.shiftSplits` réinitialise les compteurs conduite/service à la frontière indiquée ; `prevWasSplit` empêche d'ajouter le gap inter-tournée au compteur de la nouvelle tranche.

### Étape 25 — Corrections et améliorations diverses ✅

#### Attribution flux — bug magasin/entrepôt (`rendreFiltresFlux`)
- La condition de correspondance dans le calcul `utAffecteTotal` ne comparait que `magasin + marchandise`.
- Ajout de `pf.entrepot === f.entrepot` : deux flux vers le même magasin depuis des entrepôts différents ne se contaminent plus mutuellement.

#### Arrondi UT à 1 décimale (panel Tournées)
- `utAff` et `utLib` sont maintenant calculés avec `Math.round(... * 10) / 10` avant affichage.

#### Échelle Gantt Magasins désalignée
- La div d'en-tête d'échelle héritait `width: 200px` de la classe `.gantt-echelle-label`, alors que la grille de contenu fait 86 + 54 = 140 px.
- Ajout de `width:140px; max-width:140px; flex-shrink:0` en style inline pour aligner exactement l'échelle sur les colonnes de contenu.

#### Convention de départ tournée (offset)
- **Frais/Surg** : `offset` = début du chargement tracteur. `tractorRouteStart = offset + chgtDur + admDur`.
- **Non-frais** : `offset` = début de l'accrochage chauffeur (le chargement entrepôt a lieu avant son arrivée). `tractorRouteStart = offset + admDur`.
- **Gantt Modules** : `barLeft = offset` pour toutes les tournées. Segment `Chgt` hachuré bleu uniquement pour frais/surg ; aucun segment chgt pour non-frais (chargement entrepôt visible seulement dans le Gantt Remorques).
- **Gantt Remorques** : `barLeft = offset - chgtDur` pour non-frais (la remorque est occupée pendant le chargement entrepôt avant l'arrivée du chauffeur) ; `barLeft = offset` pour frais. Segment `Chgt` affiché pour tous les types.
- `accrocheStart` pour le compteur de service inter-tournée : `offset + chgtDur` (frais) ou `offset` (non-frais). Cohérent dans `calculerStats`, `calculerShifts` et `rendreGanttMagasins`.

#### Gantt Remorques — fusion de lanes par type
- **Algorithme glouton de packing** : les remorques de même type (sec / frais / surg) sont regroupées en un minimum de lignes Gantt. Deux remorques sans intersection temporelle partagent la même ligne.
- **Auto-séparation** : si un déplacement dans le Gantt Modules crée une intersection, le re-rendu recalcule les lanes et crée automatiquement une ligne supplémentaire.
- Rendu en 3 phases : pré-calcul des intervalles → packing par type → rendu par lane.

#### Drag de barre — clampage à 6h00
- Glisser une barre avant 6h00 était converti en `offset + 24h` (saut au lendemain). Désormais :
  - Pendant le drag : la barre ne peut pas aller visuellement avant 6h (quand un jour est actif).
  - Au drop : si l'offset calculé est < 6h, il est ramené à 6h00 (clamp, pas de téléportation).

---

## c) Couverture des règles métier

| Règle | Description | Statut |
|---|---|---|
| R1 | Capacité remorque (≤ 33 UT) | ✅ Vérifiée au dépôt + fraction UT assignable |
| R2 | Compatibilité marchandises (matrice sec/frais/surgelé) | ✅ Vérifiée avant modal fraction |
| R3 | Chargement PGC/NAL/BSA de jour uniquement | ✅ Heure chargement ajustée automatiquement |
| R4 | Temps de déchargement selon UT | ✅ `getTempsDecharge()` : 15 / 30 / 45 min |
| R5/R6 | Pause conduite 45 min après 4h30 | ✅ Bloc orange inséré automatiquement dans Gantt |
| R7 | Pause service 30 min après 6h | ✅ Bloc orange inséré automatiquement dans Gantt |
| R8 | Créneaux horaires magasin | ✅ Visuels Gantt Magasins + check R10 dans Valider |
| R9 | ~~Frais livraison de nuit uniquement~~ | ⛔ Règle supprimée — FL/PF livrables à toute heure |
| R10 | Séquençage arrêts prédéfini (OrdreArrêts) | ✅ Lecture `OrdreArrêts` |
| R11 | Reprise emballages ≥ 1 passage/jour/magasin | ✅ Vérification Valider + délai emballage paramétrable par arrêt |
| KPI | Coût/UT (trinôme), taux remplissage, CO₂ | ✅ Calculé depuis `AppState` |

---

## d) Architecture technique — `AppState`

```javascript
AppState = {
  jourActif,           // 'Lundi' … 'Dimanche'
  vueActive,           // 'modules' | 'remorques' | 'magasins'
  donnees,             // données Excel parsées
  wb,                  // workbook SheetJS brut
  wbDistancier,        // workbook distancier REFLEX (km + délais)
  planLocal,           // { tourneeId: [{ magasin, marchandise, ut, utAffecte, entrepot, embDelai, repriseEmb }] }
  modules,             // [{ id, tours: [tourneeId] }]
  modulesOffsets,      // { 'M1_T1': minutesDepuisMinuit }
  tourneeOverrides,    // { tid: { capacite, chgtDur, admDur, retour, zone } }
  tourneesLocales,     // tournées créées manuellement (TL01, TL02…)
  tourneeRemorque,     // { tid: remId }
  filtresFlux,         // { marchandise:{}, magasin:{}, zone:{}, entrepot:{} }
  kpiParams,           // { coutFixe, coutKmSec, coutKmFrais, coutHJour, coutHNuit, co2ParKm, prixCarboneTonne }
  PPM,                 // pixels par minute (zoom)
}
```

---

## e) Liste de contrôle

- [x] Code GAS original analysé et documenté
- [x] Structure Excel (13 onglets) analysée et mappée
- [x] SheetJS CDN intégré (aucune installation requise)
- [x] Logique métier R1–R11 portée dans le navigateur (R9 supprimée)
- [x] `heureVersMinutes()` robuste (Date Excel, fraction décimale, "HH:MM")
- [x] Gantt scrollable 0h–30h
- [x] Export / Import de session JSON
- [x] Fractions de flux + suppression de bloc
- [x] Pauses réglementaires R6/R7 automatiques
- [x] Gantt Modules avec drag inter-modules + alerte accroche
- [x] Gantt Remorques : distinction sec / frais / surgelé
- [x] Gantt Magasins synchronisé + créneaux horaires visuels + CSS Grid
- [x] Détection chevauchement tracteur (sans faux positifs)
- [x] Panel tournées : overrides locaux + barre composition couleur
- [x] Délai emballage par arrêt (0–60 min, pas de 15 min) + bloc EMB dans Gantt
- [x] Filtres multi-sélection (Marchandise, Magasin, Zone, Entrepôt)
- [x] KPI Trinôme : coût/UT, taux remplissage, coût carbone
- [x] Migration fichiers d'entrée `entrants_final/` — distancier XLSX + localStorage
- [x] Suppression dépendances Tournées / Modules / Offsets / TempsDecharge / OrdreArrêts / Chargements / Chaines / Pauses
- [x] Pauses réglementaires : découpe mid-trajet, compteur service inclut blancs inter-tournées
- [x] Gantt hebdomadaire : contexte inter-jours (veille [0h,6h] + lendemain [30h,34h]), barres fantômes, séparateurs 6h/30h
- [ ] Intégration Flux Hebdo Flotte 2027.xlsx et Table Site transport.xlsx (nouvelles sources Flux/Lieux)
- [ ] Test complet interface avec données réelles (`entrants_final/`)

---

## f) Pourcentage de progression

```
Infrastructure & migration        ████████████████████  100%
Architecture export/import        ████████████████████  100%
Logique métier R1–R11             ████████████████████  100%  (R9 supprimée, R11 enrichie)
Interface Gantt Modules           ████████████████████  100%  (drag, zoom, overrides, alerte accroche, contexte inter-jours)
Interface Gantt Magasins          ████████████████████  100%  (créneaux, sync, CSS Grid)
Interface Gantt Remorques         ████████████████████  100%  (sec / frais / surgelé distincts)
Panel tournées                    ████████████████████  100%  (composition couleur, délai emballage)
Filtres flux                      ████████████████████  100%  (multi-sélection)
KPI & coûts                       ████████████████████  100%  (trinôme, CO₂, remplissage)
Migration entrants_final/         ████████████████░░░░   80%  (distancier OK ; Flux/Lieux nouveaux fichiers restants)
```

**Progression globale : ~97%**

---

## g) Prochaines actions possibles

1. **Intégrer Flux Hebdo Flotte 2027.xlsx** comme source de l'onglet Flux (remplace l'onglet `Flux` de Fleet V7.1).
2. **Intégrer Table Site transport.xlsx** comme source des lieux (remplace l'onglet `Lieux`).
3. **Test en conditions réelles** : charger les fichiers `entrants_final/`, vérifier toutes les fonctionnalités.
4. **Export CSV** (optionnel) : une ligne par livraison planifiée avec module, tournée, magasin, heure estimée.
5. **Affrètement** : intégrer la grille tarifaire des transporteurs externes et le moteur d'arbitrage flotte propre / affrètement.
6. **Optimisation automatique** (optionnel) : algorithme glouton étendu ou solveur.
