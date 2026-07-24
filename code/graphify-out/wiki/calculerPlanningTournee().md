# calculerPlanningTournee()

> God node · 6 connections · [C:\Users\STE0059945\Documents\Coding\Output\code\code.js](file:///C:/Users/STE0059945/Documents/Coding/Output/code/code.js#L429)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as calculerPlanningTournee()
    participant P1 as verifierR9Journee()
    participant P2 as ouvrirClasseur()
    participant P3 as validerRegleR9()
    participant P4 as validerTourneeDepuisUI()
    participant P5 as verifierRepriseEmballagesJour()
    participant P6 as calculerKPIJour()
    participant P7 as diagnosticComplet()
    participant P8 as ecrireOnglet()
    participant P9 as chargerDonnees()
    participant P10 as minutesVersHeure()
    participant P11 as calculerPlanningAvecPauses()
    participant P12 as magasinDisponible()
    participant P13 as lireTournees()
    participant P14 as lireDistancier()
    participant P15 as lireReglesDech()
    participant P16 as lireChargements()
    participant P17 as lireOffsets()
    participant P18 as heureVersMinutes()
    participant P19 as validerLivraisonFraisNuit()
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
    P1->>+ P0: calls
    P0-->>- P1: return
    P1->>+ P10: calls
    P10-->>- P1: return
    P10->>+ P1: calls
    P1-->>- P10: return
    P10->>+ P0: calls
    P0-->>- P10: return
    P10->>+ P11: calls
    P11-->>- P10: return
    P10->>+ P12: calls
    P12-->>- P10: return
    P1->>+ P13: calls
    P13-->>- P1: return
    P1->>+ P14: calls
    P14-->>- P1: return
    P1->>+ P15: calls
    P15-->>- P1: return
    P1->>+ P16: calls
    P16-->>- P1: return
    P1->>+ P17: calls
    P17-->>- P1: return
    P0->>+ P18: calls
    P18-->>- P0: return
    P0->>+ P10: calls
    P10-->>- P0: return
    P0->>+ P19: calls
    P19-->>- P0: return
    P0->>+ P3: calls
    P3-->>- P0: return
```

## Connections by Relation

### calls
- [[verifierR9Journee()]] `EXTRACTED`
- [[heureVersMinutes()]] `EXTRACTED`
- [[minutesVersHeure()]] `EXTRACTED`
- [[validerLivraisonFraisNuit()]] `EXTRACTED`
- [[validerRegleR9()]] `EXTRACTED`

### contains
- [[code.js]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*