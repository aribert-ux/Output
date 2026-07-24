# validerRegleR9()

> God node · 5 connections · [C:\Users\STE0059945\Documents\Coding\Output\code\code.js](file:///C:/Users/STE0059945/Documents/Coding/Output/code/code.js#L928)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as validerRegleR9()
    participant P1 as ouvrirClasseur()
    participant P2 as verifierR9Journee()
    participant P3 as calculerPlanningTournee()
    participant P4 as minutesVersHeure()
    participant P5 as lireTournees()
    participant P6 as lireDistancier()
    participant P7 as lireReglesDech()
    participant P8 as lireChargements()
    participant P9 as lireOffsets()
    participant P10 as validerTourneeDepuisUI()
    participant P11 as validerTournee()
    participant P12 as chargerDistancier()
    participant P13 as chargerCreneauxMagasins()
    participant P14 as verifierRepriseEmballagesJour()
    participant P15 as calculerKPIJour()
    participant P16 as diagnosticComplet()
    participant P17 as ecrireOnglet()
    participant P18 as chargerDonnees()
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
    P10->>+ P11: calls
    P11-->>- P10: return
    P10->>+ P1: calls
    P1-->>- P10: return
    P10->>+ P12: calls
    P12-->>- P10: return
    P10->>+ P13: calls
    P13-->>- P10: return
    P1->>+ P14: calls
    P14-->>- P1: return
    P1->>+ P15: calls
    P15-->>- P1: return
    P1->>+ P16: calls
    P16-->>- P1: return
    P1->>+ P17: calls
    P17-->>- P1: return
    P1->>+ P18: calls
    P18-->>- P1: return
    P0->>+ P3: calls
    P3-->>- P0: return
    P0->>+ P6: calls
    P6-->>- P0: return
    P0->>+ P7: calls
    P7-->>- P0: return
```

## Connections by Relation

### calls
- [[ouvrirClasseur()]] `EXTRACTED`
- [[calculerPlanningTournee()]] `EXTRACTED`
- [[lireDistancier()]] `EXTRACTED`
- [[lireReglesDech()]] `EXTRACTED`

### contains
- [[code.js]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*