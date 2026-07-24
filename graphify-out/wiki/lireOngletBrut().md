# lireOngletBrut()

> God node · 11 connections · [C:\Users\STE0059945\Documents\Coding\Output\code\code.js](file:///C:/Users/STE0059945/Documents/Coding/Output/code/code.js#L40)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as lireOngletBrut()
    participant P1 as verifierRepriseEmballagesJour()
    participant P2 as ouvrirClasseur()
    participant P3 as verifierR9Journee()
    participant P4 as validerRegleR9()
    participant P5 as validerTourneeDepuisUI()
    participant P6 as calculerKPIJour()
    participant P7 as diagnosticComplet()
    participant P8 as ecrireOnglet()
    participant P9 as chargerDonnees()
    participant P10 as lireTournees()
    participant P11 as validerRepriseEmballages()
    participant P12 as lireDistancier()
    participant P13 as lireReglesDech()
    participant P14 as lireChargements()
    participant P15 as lireOffsets()
    participant P16 as chargerDistancier()
    participant P17 as chargerCreneauxMagasins()
    P0->>+ P1: calls
    P1-->>- P0: return
    P1->>+ P0: calls
    P0-->>- P1: return
    P1->>+ P2: calls
    P2-->>- P1: return
    P2->>+ P3: calls
    P3-->>- P2: return
    P2->>+ P4: calls
    P4-->>- P2: return
    P2->>+ P5: calls
    P5-->>- P2: return
    P2->>+ P1: calls
    P1-->>- P2: return
    P2->>+ P6: calls
    P6-->>- P2: return
    P2->>+ P7: calls
    P7-->>- P2: return
    P2->>+ P8: calls
    P8-->>- P2: return
    P2->>+ P9: calls
    P9-->>- P2: return
    P1->>+ P10: calls
    P10-->>- P1: return
    P10->>+ P0: calls
    P0-->>- P10: return
    P10->>+ P3: calls
    P3-->>- P10: return
    P10->>+ P1: calls
    P1-->>- P10: return
    P1->>+ P11: calls
    P11-->>- P1: return
    P0->>+ P12: calls
    P12-->>- P0: return
    P0->>+ P13: calls
    P13-->>- P0: return
    P0->>+ P10: calls
    P10-->>- P0: return
    P0->>+ P6: calls
    P6-->>- P0: return
    P0->>+ P7: calls
    P7-->>- P0: return
    P0->>+ P14: calls
    P14-->>- P0: return
    P0->>+ P15: calls
    P15-->>- P0: return
    P0->>+ P16: calls
    P16-->>- P0: return
    P0->>+ P17: calls
    P17-->>- P0: return
```

## Connections by Relation

### calls
- [[verifierRepriseEmballagesJour()]] `EXTRACTED`
- [[lireDistancier()]] `EXTRACTED`
- [[lireReglesDech()]] `EXTRACTED`
- [[lireTournees()]] `EXTRACTED`
- [[calculerKPIJour()]] `EXTRACTED`
- [[diagnosticComplet()]] `EXTRACTED`
- [[lireChargements()]] `EXTRACTED`
- [[lireOffsets()]] `EXTRACTED`
- [[chargerDistancier()]] `EXTRACTED`
- [[chargerCreneauxMagasins()]] `EXTRACTED`

### contains
- [[code.js]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*