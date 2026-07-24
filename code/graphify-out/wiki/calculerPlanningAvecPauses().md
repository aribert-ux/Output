# calculerPlanningAvecPauses()

> God node · 5 connections · [C:\Users\STE0059945\Documents\Coding\Output\code\code.js](file:///C:/Users/STE0059945/Documents/Coding/Output/code/code.js#L287)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as calculerPlanningAvecPauses()
    participant P1 as validerTournee()
    participant P2 as heureVersMinutes()
    participant P3 as calculerPlanningTournee()
    participant P4 as validerLivraisonFraisNuit()
    participant P5 as validerContraintesChargement()
    participant P6 as validerContraintesLivraison()
    participant P7 as validerTourneeDepuisUI()
    participant P8 as ouvrirClasseur()
    participant P9 as chargerDistancier()
    participant P10 as chargerCreneauxMagasins()
    participant P11 as getTempsDecharge()
    participant P12 as magasinDisponible()
    participant P13 as validerCapaciteRemorque()
    participant P14 as validerCompatibiliteMarchandises()
    participant P15 as creerRegistreOccupation()
    participant P16 as enregistrerOccupation()
    participant P17 as minutesVersHeure()
    P0->>+ P1: calls
    P1-->>- P0: return
    P1->>+ P2: calls
    P2-->>- P1: return
    P2->>+ P1: calls
    P1-->>- P2: return
    P2->>+ P3: calls
    P3-->>- P2: return
    P2->>+ P0: calls
    P0-->>- P2: return
    P2->>+ P4: calls
    P4-->>- P2: return
    P2->>+ P5: calls
    P5-->>- P2: return
    P2->>+ P6: calls
    P6-->>- P2: return
    P1->>+ P0: calls
    P0-->>- P1: return
    P1->>+ P7: calls
    P7-->>- P1: return
    P7->>+ P1: calls
    P1-->>- P7: return
    P7->>+ P8: calls
    P8-->>- P7: return
    P7->>+ P9: calls
    P9-->>- P7: return
    P7->>+ P10: calls
    P10-->>- P7: return
    P1->>+ P5: calls
    P5-->>- P1: return
    P1->>+ P6: calls
    P6-->>- P1: return
    P1->>+ P11: calls
    P11-->>- P1: return
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
    P0->>+ P2: calls
    P2-->>- P0: return
    P0->>+ P17: calls
    P17-->>- P0: return
    P0->>+ P11: calls
    P11-->>- P0: return
```

## Connections by Relation

### calls
- [[validerTournee()]] `EXTRACTED`
- [[heureVersMinutes()]] `EXTRACTED`
- [[minutesVersHeure()]] `EXTRACTED`
- [[getTempsDecharge()]] `EXTRACTED`

### contains
- [[code.js]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*