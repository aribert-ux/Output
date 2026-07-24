# validerTournee()

> God node · 12 connections · [C:\Users\STE0059945\Documents\Coding\Output\code\code.js](file:///C:/Users/STE0059945/Documents/Coding/Output/code/code.js#L637)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as validerTournee()
    participant P1 as heureVersMinutes()
    participant P2 as calculerPlanningTournee()
    participant P3 as verifierR9Journee()
    participant P4 as minutesVersHeure()
    participant P5 as validerLivraisonFraisNuit()
    participant P6 as validerRegleR9()
    participant P7 as calculerPlanningAvecPauses()
    participant P8 as getTempsDecharge()
    participant P9 as estNuit()
    participant P10 as validerTourneeRegleR9()
    participant P11 as validerContraintesChargement()
    participant P12 as validerContraintesLivraison()
    participant P13 as validerTourneeDepuisUI()
    participant P14 as magasinDisponible()
    participant P15 as validerCapaciteRemorque()
    participant P16 as validerCompatibiliteMarchandises()
    participant P17 as creerRegistreOccupation()
    participant P18 as enregistrerOccupation()
    P0->>+ P1: calls
    P1-->>- P0: return
    P1->>+ P0: calls
    P0-->>- P1: return
    P1->>+ P2: calls
    P2-->>- P1: return
    P2->>+ P3: calls
    P3-->>- P2: return
    P2->>+ P1: calls
    P1-->>- P2: return
    P2->>+ P4: calls
    P4-->>- P2: return
    P2->>+ P5: calls
    P5-->>- P2: return
    P2->>+ P6: calls
    P6-->>- P2: return
    P1->>+ P7: calls
    P7-->>- P1: return
    P7->>+ P0: calls
    P0-->>- P7: return
    P7->>+ P1: calls
    P1-->>- P7: return
    P7->>+ P4: calls
    P4-->>- P7: return
    P7->>+ P8: calls
    P8-->>- P7: return
    P1->>+ P5: calls
    P5-->>- P1: return
    P5->>+ P1: calls
    P1-->>- P5: return
    P5->>+ P2: calls
    P2-->>- P5: return
    P5->>+ P9: calls
    P9-->>- P5: return
    P5->>+ P10: calls
    P10-->>- P5: return
    P1->>+ P11: calls
    P11-->>- P1: return
    P1->>+ P12: calls
    P12-->>- P1: return
    P0->>+ P7: calls
    P7-->>- P0: return
    P0->>+ P13: calls
    P13-->>- P0: return
    P0->>+ P11: calls
    P11-->>- P0: return
    P0->>+ P12: calls
    P12-->>- P0: return
    P0->>+ P8: calls
    P8-->>- P0: return
    P0->>+ P14: calls
    P14-->>- P0: return
    P0->>+ P15: calls
    P15-->>- P0: return
    P0->>+ P16: calls
    P16-->>- P0: return
    P0->>+ P17: calls
    P17-->>- P0: return
    P0->>+ P18: calls
    P18-->>- P0: return
```

## Connections by Relation

### calls
- [[heureVersMinutes()]] `EXTRACTED`
- [[calculerPlanningAvecPauses()]] `EXTRACTED`
- [[validerTourneeDepuisUI()]] `EXTRACTED`
- [[validerContraintesChargement()]] `EXTRACTED`
- [[validerContraintesLivraison()]] `EXTRACTED`
- [[getTempsDecharge()]] `EXTRACTED`
- [[magasinDisponible()]] `EXTRACTED`
- [[validerCapaciteRemorque()]] `EXTRACTED`
- [[validerCompatibiliteMarchandises()]] `EXTRACTED`
- [[creerRegistreOccupation()]] `EXTRACTED`
- [[enregistrerOccupation()]] `EXTRACTED`

### contains
- [[code.js]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*