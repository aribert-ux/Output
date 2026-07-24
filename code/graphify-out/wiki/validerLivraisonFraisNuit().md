# validerLivraisonFraisNuit()

> God node · 5 connections · [C:\Users\STE0059945\Documents\Coding\Output\code\code.js](file:///C:/Users/STE0059945/Documents/Coding/Output/code/code.js#L372)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as validerLivraisonFraisNuit()
    participant P1 as heureVersMinutes()
    participant P2 as validerTournee()
    participant P3 as calculerPlanningAvecPauses()
    participant P4 as validerTourneeDepuisUI()
    participant P5 as validerContraintesChargement()
    participant P6 as validerContraintesLivraison()
    participant P7 as getTempsDecharge()
    participant P8 as magasinDisponible()
    participant P9 as validerCapaciteRemorque()
    participant P10 as validerCompatibiliteMarchandises()
    participant P11 as creerRegistreOccupation()
    participant P12 as enregistrerOccupation()
    participant P13 as calculerPlanningTournee()
    participant P14 as verifierR9Journee()
    participant P15 as minutesVersHeure()
    participant P16 as validerRegleR9()
    participant P17 as estNuit()
    participant P18 as validerTourneeRegleR9()
    P0->>+ P1: calls
    P1-->>- P0: return
    P1->>+ P2: calls
    P2-->>- P1: return
    P2->>+ P1: calls
    P1-->>- P2: return
    P2->>+ P3: calls
    P3-->>- P2: return
    P2->>+ P4: calls
    P4-->>- P2: return
    P2->>+ P5: calls
    P5-->>- P2: return
    P2->>+ P6: calls
    P6-->>- P2: return
    P2->>+ P7: calls
    P7-->>- P2: return
    P2->>+ P8: calls
    P8-->>- P2: return
    P2->>+ P9: calls
    P9-->>- P2: return
    P2->>+ P10: calls
    P10-->>- P2: return
    P2->>+ P11: calls
    P11-->>- P2: return
    P2->>+ P12: calls
    P12-->>- P2: return
    P1->>+ P13: calls
    P13-->>- P1: return
    P13->>+ P14: calls
    P14-->>- P13: return
    P13->>+ P1: calls
    P1-->>- P13: return
    P13->>+ P15: calls
    P15-->>- P13: return
    P13->>+ P0: calls
    P0-->>- P13: return
    P13->>+ P16: calls
    P16-->>- P13: return
    P1->>+ P3: calls
    P3-->>- P1: return
    P1->>+ P0: calls
    P0-->>- P1: return
    P1->>+ P5: calls
    P5-->>- P1: return
    P1->>+ P6: calls
    P6-->>- P1: return
    P0->>+ P13: calls
    P13-->>- P0: return
    P0->>+ P17: calls
    P17-->>- P0: return
    P0->>+ P18: calls
    P18-->>- P0: return
```

## Connections by Relation

### calls
- [[heureVersMinutes()]] `EXTRACTED`
- [[calculerPlanningTournee()]] `EXTRACTED`
- [[estNuit()]] `EXTRACTED`
- [[validerTourneeRegleR9()]] `EXTRACTED`

### contains
- [[code.js]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*