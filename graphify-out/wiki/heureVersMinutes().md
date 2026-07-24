# heureVersMinutes()

> God node · 7 connections · [C:\Users\STE0059945\Documents\Coding\Output\code\code.js](file:///C:/Users/STE0059945/Documents/Coding/Output/code/code.js#L88)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as heureVersMinutes()
    participant P1 as validerTournee()
    participant P2 as calculerPlanningAvecPauses()
    participant P3 as minutesVersHeure()
    participant P4 as getTempsDecharge()
    participant P5 as validerTourneeDepuisUI()
    participant P6 as ouvrirClasseur()
    participant P7 as chargerDistancier()
    participant P8 as chargerCreneauxMagasins()
    participant P9 as validerContraintesChargement()
    participant P10 as estJour()
    participant P11 as validerContraintesLivraison()
    participant P12 as magasinDisponible()
    participant P13 as validerCapaciteRemorque()
    participant P14 as validerCompatibiliteMarchandises()
    participant P15 as creerRegistreOccupation()
    participant P16 as enregistrerOccupation()
    participant P17 as calculerPlanningTournee()
    participant P18 as validerLivraisonFraisNuit()
    P0->>+ P1: calls
    P1-->>- P0: return
    P1->>+ P0: calls
    P0-->>- P1: return
    P1->>+ P2: calls
    P2-->>- P1: return
    P2->>+ P1: calls
    P1-->>- P2: return
    P2->>+ P0: calls
    P0-->>- P2: return
    P2->>+ P3: calls
    P3-->>- P2: return
    P2->>+ P4: calls
    P4-->>- P2: return
    P1->>+ P5: calls
    P5-->>- P1: return
    P5->>+ P1: calls
    P1-->>- P5: return
    P5->>+ P6: calls
    P6-->>- P5: return
    P5->>+ P7: calls
    P7-->>- P5: return
    P5->>+ P8: calls
    P8-->>- P5: return
    P1->>+ P9: calls
    P9-->>- P1: return
    P9->>+ P1: calls
    P1-->>- P9: return
    P9->>+ P0: calls
    P0-->>- P9: return
    P9->>+ P10: calls
    P10-->>- P9: return
    P1->>+ P11: calls
    P11-->>- P1: return
    P1->>+ P4: calls
    P4-->>- P1: return
    P1->>+ P12: calls
    P12-->>- P1: return
    P1->>+ P13: calls
    P13-->>- P1: return
    P1->>+ P14: calls
    P14-->>- P1: return
    P1->>+ P15: calls
    P15-->>- P1: return
    P1->>+ P16: calls
    P16-->>- P1: return
    P0->>+ P17: calls
    P17-->>- P0: return
    P0->>+ P2: calls
    P2-->>- P0: return
    P0->>+ P18: calls
    P18-->>- P0: return
    P0->>+ P9: calls
    P9-->>- P0: return
    P0->>+ P11: calls
    P11-->>- P0: return
```

## Connections by Relation

### calls
- [[validerTournee()]] `EXTRACTED`
- [[calculerPlanningTournee()]] `EXTRACTED`
- [[calculerPlanningAvecPauses()]] `EXTRACTED`
- [[validerLivraisonFraisNuit()]] `EXTRACTED`
- [[validerContraintesChargement()]] `EXTRACTED`
- [[validerContraintesLivraison()]] `EXTRACTED`

### contains
- [[code.js]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*