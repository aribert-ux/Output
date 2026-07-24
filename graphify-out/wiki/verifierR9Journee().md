# verifierR9Journee()

> God node · 9 connections · [C:\Users\STE0059945\Documents\Coding\Output\code\code.js](file:///C:/Users/STE0059945/Documents/Coding/Output/code/code.js#L873)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as verifierR9Journee()
    participant P1 as ouvrirClasseur()
    participant P2 as validerRegleR9()
    participant P3 as calculerPlanningTournee()
    participant P4 as lireDistancier()
    participant P5 as lireReglesDech()
    participant P6 as validerTourneeDepuisUI()
    participant P7 as validerTournee()
    participant P8 as chargerDistancier()
    participant P9 as chargerCreneauxMagasins()
    participant P10 as verifierRepriseEmballagesJour()
    participant P11 as lireOngletBrut()
    participant P12 as lireTournees()
    participant P13 as validerRepriseEmballages()
    participant P14 as calculerKPIJour()
    participant P15 as diagnosticComplet()
    participant P16 as ecrireOnglet()
    participant P17 as chargerDonnees()
    participant P18 as minutesVersHeure()
    participant P19 as lireChargements()
    participant P20 as lireOffsets()
    P0->>+ P1: calls
    P1-->>- P0: return
    P1->>+ P0: calls
    P0-->>- P1: return
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
    P1->>+ P6: calls
    P6-->>- P1: return
    P6->>+ P7: calls
    P7-->>- P6: return
    P6->>+ P1: calls
    P1-->>- P6: return
    P6->>+ P8: calls
    P8-->>- P6: return
    P6->>+ P9: calls
    P9-->>- P6: return
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
    P0->>+ P3: calls
    P3-->>- P0: return
    P0->>+ P18: calls
    P18-->>- P0: return
    P0->>+ P12: calls
    P12-->>- P0: return
    P0->>+ P4: calls
    P4-->>- P0: return
    P0->>+ P5: calls
    P5-->>- P0: return
    P0->>+ P19: calls
    P19-->>- P0: return
    P0->>+ P20: calls
    P20-->>- P0: return
```

## Connections by Relation

### calls
- [[ouvrirClasseur()]] `EXTRACTED`
- [[calculerPlanningTournee()]] `EXTRACTED`
- [[minutesVersHeure()]] `EXTRACTED`
- [[lireTournees()]] `EXTRACTED`
- [[lireDistancier()]] `EXTRACTED`
- [[lireReglesDech()]] `EXTRACTED`
- [[lireChargements()]] `EXTRACTED`
- [[lireOffsets()]] `EXTRACTED`

### contains
- [[code.js]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*