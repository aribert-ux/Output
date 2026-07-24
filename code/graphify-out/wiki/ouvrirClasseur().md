# ouvrirClasseur()

> God node · 9 connections · [C:\Users\STE0059945\Documents\Coding\Output\code\code.js](file:///C:/Users/STE0059945/Documents/Coding/Output/code/code.js#L35)

## Call Trace Diagram

```mermaid
sequenceDiagram
    participant P0 as ouvrirClasseur()
    participant P1 as verifierR9Journee()
    participant P2 as calculerPlanningTournee()
    participant P3 as heureVersMinutes()
    participant P4 as minutesVersHeure()
    participant P5 as validerLivraisonFraisNuit()
    participant P6 as validerRegleR9()
    participant P7 as calculerPlanningAvecPauses()
    participant P8 as magasinDisponible()
    participant P9 as lireTournees()
    participant P10 as lireOngletBrut()
    participant P11 as verifierRepriseEmballagesJour()
    participant P12 as lireDistancier()
    participant P13 as lireReglesDech()
    participant P14 as lireChargements()
    participant P15 as lireOffsets()
    participant P16 as validerTourneeDepuisUI()
    participant P17 as calculerKPIJour()
    participant P18 as diagnosticComplet()
    participant P19 as ecrireOnglet()
    participant P20 as chargerDonnees()
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
    P2->>+ P6: calls
    P6-->>- P2: return
    P1->>+ P4: calls
    P4-->>- P1: return
    P4->>+ P1: calls
    P1-->>- P4: return
    P4->>+ P2: calls
    P2-->>- P4: return
    P4->>+ P7: calls
    P7-->>- P4: return
    P4->>+ P8: calls
    P8-->>- P4: return
    P1->>+ P9: calls
    P9-->>- P1: return
    P9->>+ P10: calls
    P10-->>- P9: return
    P9->>+ P1: calls
    P1-->>- P9: return
    P9->>+ P11: calls
    P11-->>- P9: return
    P1->>+ P12: calls
    P12-->>- P1: return
    P1->>+ P13: calls
    P13-->>- P1: return
    P1->>+ P14: calls
    P14-->>- P1: return
    P1->>+ P15: calls
    P15-->>- P1: return
    P0->>+ P6: calls
    P6-->>- P0: return
    P0->>+ P16: calls
    P16-->>- P0: return
    P0->>+ P11: calls
    P11-->>- P0: return
    P0->>+ P17: calls
    P17-->>- P0: return
    P0->>+ P18: calls
    P18-->>- P0: return
    P0->>+ P19: calls
    P19-->>- P0: return
    P0->>+ P20: calls
    P20-->>- P0: return
```

## Connections by Relation

### calls
- [[verifierR9Journee()]] `EXTRACTED`
- [[validerRegleR9()]] `EXTRACTED`
- [[validerTourneeDepuisUI()]] `EXTRACTED`
- [[verifierRepriseEmballagesJour()]] `EXTRACTED`
- [[calculerKPIJour()]] `EXTRACTED`
- [[diagnosticComplet()]] `EXTRACTED`
- [[ecrireOnglet()]] `EXTRACTED`
- [[chargerDonnees()]] `EXTRACTED`

### contains
- [[code.js]] `EXTRACTED`

---

*Part of the graphify knowledge wiki. See [[index]] to navigate.*