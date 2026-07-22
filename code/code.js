'use strict';
// ============================================================
// AUCHAN TRANSPORT — OUTIL DE PLANIFICATION
// code.js v7.1 — Adaptation Node.js (lecture depuis Excel local)
// ============================================================

const xlsx = require('xlsx');
const path = require('path');

const FILE_EXCEL = path.join(__dirname, 'Fleet V7.1.xlsx');

// ────────────────────────────────────────────────────────────
// NOMS DES ONGLETS
// ────────────────────────────────────────────────────────────
var SHEET_FLUX         = 'Flux';
var SHEET_TOURNEES     = 'Tournées';
var SHEET_DISTANCIER   = 'Distancier';
var SHEET_PLAGES       = 'PlagesOuverture';
var SHEET_MODULES      = 'Modules';
var SHEET_OFFSETS      = 'Offsets';
var SHEET_ORDRE        = 'OrdreArrêts';
var SHEET_LIEUX        = 'Lieux';
var SHEET_DECH         = 'TempsDecharge';
var SHEET_PLAN         = 'Plan';
var SHEET_COUTS        = 'Couts_Modules';
var SHEET_AFFRETEMENTS = 'Affretements';
var SHEET_CHAINES      = 'Chaines';
var SHEET_PAUSES       = 'PausesPosees';
var SHEET_CHARGEMENTS  = 'Chargements';

// ────────────────────────────────────────────────────────────
// ADAPTATEUR XLSX — remplace SpreadsheetApp
// ────────────────────────────────────────────────────────────

function ouvrirClasseur() {
  return xlsx.readFile(FILE_EXCEL);
}

// Équivalent de sheet.getDataRange().getValues() — retourne un tableau de tableaux
function lireOngletBrut(wb, nomOnglet) {
  var sheet = wb.Sheets[nomOnglet];
  if (!sheet) return [];
  return xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });
}

// Écrit des données dans un onglet et sauvegarde le fichier Excel
function ecrireOnglet(nomOnglet, donnees) {
  var wb = ouvrirClasseur();
  var ws = xlsx.utils.aoa_to_sheet(donnees && donnees.length > 0 ? donnees : [[]]);
  wb.Sheets[nomOnglet] = ws;
  if (wb.SheetNames.indexOf(nomOnglet) < 0) wb.SheetNames.push(nomOnglet);
  xlsx.writeFile(wb, FILE_EXCEL);
}

// ────────────────────────────────────────────────────────────
// CONSTANTES MÉTIER
// ────────────────────────────────────────────────────────────
var MARCHANDISES_FRAIS          = ['FL', 'PF'];
var MARCHANDISES_JOUR_SEULEMENT = ['PGC', 'NAL', 'BSA'];
var HEURE_DEBUT_NUIT_MIN        = 22 * 60;
var HEURE_FIN_NUIT_MIN          = 6  * 60;

var REGLES = {
  CAPACITE_MAX_UT:    33,
  PAUSE_CONDUITE_MIN: 270,
  PAUSE_SERVICE_MIN:  360,
  PAUSE_COURTE_DUREE: 30,
  PAUSE_LONGUE_DUREE: 45,
  HEURE_DEBUT_JOUR:   6,
  HEURE_FIN_JOUR:     22,
};

var MATRICE_COMPATIBILITE = {
  'PGC':  { 'PGC': true,  'NAL': true,  'BSA': true,  'FL': false, 'PF': false, 'SURG': false },
  'NAL':  { 'PGC': true,  'NAL': true,  'BSA': true,  'FL': false, 'PF': false, 'SURG': false },
  'BSA':  { 'PGC': true,  'NAL': true,  'BSA': true,  'FL': false, 'PF': false, 'SURG': false },
  'FL':   { 'PGC': false, 'NAL': false, 'BSA': false, 'FL': true,  'PF': true,  'SURG': false },
  'PF':   { 'PGC': false, 'NAL': false, 'BSA': false, 'FL': true,  'PF': true,  'SURG': false },
  'SURG': { 'PGC': false, 'NAL': false, 'BSA': false, 'FL': false, 'PF': false, 'SURG': true  },
};

// ────────────────────────────────────────────────────────────
// UTILITAIRES HORAIRES
// ────────────────────────────────────────────────────────────

// Convertit une heure en minutes depuis minuit.
// Accepte : "HH:MM", fraction décimale Excel (0.25 = 06:00), ou objet Date.
function heureVersMinutes(heure) {
  if (heure === null || heure === undefined || heure === '') return null;

  // Fraction décimale Excel : 0.0 (00:00) → 1.0 (24:00)
  if (typeof heure === 'number') {
    return Math.round(heure * 24 * 60);
  }

  // Objet Date issu de xlsx
  if (heure instanceof Date) {
    return heure.getHours() * 60 + heure.getMinutes();
  }

  // Chaîne "HH:MM"
  var str   = String(heure).trim();
  var parts = str.split(':');
  if (parts.length !== 2) return null;
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
}

function minutesVersHeure(minutes) {
  var h = Math.floor(minutes / 60) % 24;
  var m = minutes % 60;
  return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
}

function estNuit(heureMinutes) {
  return heureMinutes >= HEURE_DEBUT_NUIT_MIN || heureMinutes < HEURE_FIN_NUIT_MIN;
}

function estJour(heureMinutes) {
  return !estNuit(heureMinutes);
}

// ────────────────────────────────────────────────────────────
// CALCUL DU TEMPS DE DÉCHARGEMENT
// ────────────────────────────────────────────────────────────

// 1–9 UT = 15 min | 10–18 UT = 30 min | 19–33 UT = 45 min
function getTempsDecharge(nbUT) {
  if (nbUT <= 0)  return 0;
  if (nbUT <= 9)  return 15;
  if (nbUT <= 18) return 30;
  return 45;
}

// ────────────────────────────────────────────────────────────
// CONTRAINTE "UNE LIVRAISON À LA FOIS PAR MAGASIN"
// ────────────────────────────────────────────────────────────

/**
 * Crée un registre d'occupation vide.
 * Structure : { magasin: [ { debut, fin, tourneeId } ] }
 */
function creerRegistreOccupation() {
  return {};
}

/**
 * Vérifie si un magasin est disponible sur une plage horaire donnée.
 * Retourne { disponible: true } ou { disponible: false, conflit: {...} }
 */
function magasinDisponible(magasin, debutMin, finMin, registre, tourneeIdCourante) {
  var plages = registre[magasin] || [];
  for (var i = 0; i < plages.length; i++) {
    var p = plages[i];
    // Ignorer les plages de la même tournée (même arrêt, flux multiples)
    if (p.tourneeId === tourneeIdCourante) continue;
    // Chevauchement : début < fin existante ET fin > début existant
    if (debutMin < p.fin && finMin > p.debut) {
      return {
        disponible: false,
        conflit: {
          tourneeId: p.tourneeId,
          debut:     minutesVersHeure(p.debut),
          fin:       minutesVersHeure(p.fin)
        }
      };
    }
  }
  return { disponible: true };
}

/**
 * Enregistre une plage d'occupation pour un magasin.
 */
function enregistrerOccupation(magasin, debutMin, finMin, tourneeId, registre) {
  if (!registre[magasin]) registre[magasin] = [];
  registre[magasin].push({ debut: debutMin, fin: finMin, tourneeId: tourneeId });
}

/**
 * Libère une plage d'occupation (utilisé lors du LNS destroy).
 */
function libererOccupation(magasin, debutMin, tourneeId, registre) {
  if (!registre[magasin]) return;
  registre[magasin] = registre[magasin].filter(function(p) {
    return !(p.tourneeId === tourneeId && p.debut === debutMin);
  });
}

// ────────────────────────────────────────────────────────────
// R1 — CAPACITÉ REMORQUE
// ────────────────────────────────────────────────────────────

function validerCapaciteRemorque(flux, capaciteMax) {
  var capacite = capaciteMax || REGLES.CAPACITE_MAX_UT;
  var utTotal  = flux.reduce(function(sum, f) { return sum + (parseFloat(f.ut) || 0); }, 0);

  if (utTotal > capacite) {
    return {
      valide:   false,
      utTotal:  utTotal,
      utMax:    capacite,
      message:  '⚠️ R1 — Capacité dépassée : ' + utTotal + ' UT chargées pour ' + capacite + ' UT max',
      severite: 'ERREUR'
    };
  }

  var tauxRemplissage = Math.round((utTotal / capacite) * 100);
  return {
    valide:          true,
    utTotal:         utTotal,
    utMax:           capacite,
    tauxRemplissage: tauxRemplissage,
    message:         '✅ R1 — Capacité OK : ' + utTotal + '/' + capacite + ' UT (' + tauxRemplissage + '%)',
    severite:        'OK'
  };
}

// ────────────────────────────────────────────────────────────
// R2 — COMPATIBILITÉ MARCHANDISES
// ────────────────────────────────────────────────────────────

function validerCompatibiliteMarchandises(flux) {
  var marchandises = [];
  flux.forEach(function(f) {
    var m = (f.marchandise || '').toUpperCase();
    if (m && marchandises.indexOf(m) < 0) marchandises.push(m);
  });

  var incompatibilites = [];
  for (var i = 0; i < marchandises.length; i++) {
    for (var j = i + 1; j < marchandises.length; j++) {
      var m1      = marchandises[i];
      var m2      = marchandises[j];
      var matrice = MATRICE_COMPATIBILITE[m1];
      if (matrice && matrice[m2] === false) incompatibilites.push(m1 + ' ≠ ' + m2);
    }
  }

  if (incompatibilites.length > 0) {
    return {
      valide:           false,
      incompatibilites: incompatibilites,
      message:          '⚠️ R2 — Incompatibilité marchandises : ' + incompatibilites.join(' | '),
      severite:         'ERREUR'
    };
  }

  return {
    valide:           true,
    incompatibilites: [],
    message:          '✅ R2 — Marchandises compatibles : ' + marchandises.join(', '),
    severite:         'OK'
  };
}

// ────────────────────────────────────────────────────────────
// R3/R4 — CONTRAINTES HORAIRES DE CHARGEMENT
// ────────────────────────────────────────────────────────────

function validerContraintesChargement(flux, heureChargement) {
  var heureMin = heureVersMinutes(heureChargement);
  if (heureMin === null) {
    return { valide: false, message: '⚠️ R3 — Heure de chargement invalide : ' + heureChargement, severite: 'ERREUR' };
  }

  var isJour     = estJour(heureMin);
  var violations = [];

  flux.forEach(function(f) {
    var marchandise = (f.marchandise || '').toUpperCase();
    if (MARCHANDISES_JOUR_SEULEMENT.indexOf(marchandise) >= 0 && !isJour) {
      violations.push(marchandise + ' ne peut être chargé qu\'en journée (06h–22h), chargement prévu à ' + heureChargement);
    }
  });

  if (violations.length > 0) {
    return { valide: false, violations: violations, message: '⚠️ R3 — Contrainte chargement : ' + violations.join(' | '), severite: 'ERREUR' };
  }

  return { valide: true, violations: [], message: '✅ R3/R4 — Chargement autorisé à ' + heureChargement, severite: 'OK' };
}

// ────────────────────────────────────────────────────────────
// R6/R7 — PAUSES LÉGALES (version simple sans distMap)
// ────────────────────────────────────────────────────────────

function calculerPlanningAvecPauses(heureDepart, arrets, distancier) {
  var planning               = [];
  var pauses                 = [];
  var alertes                = [];
  var heureActuelle          = heureVersMinutes(heureDepart) || 0;
  var minutesConduite        = 0;
  var minutesService         = 0;
  var lieuPrecedent          = 'ENTREPOT';
  var pauseServiceFaite      = false;
  var bonusPauseConduiteUsed = false;

  arrets.forEach(function(arret, index) {
    var trajet      = distancier && distancier[lieuPrecedent] ? distancier[lieuPrecedent][arret.lieu] : null;
    var dureeTrajet = trajet ? (trajet.minutes || 0) : 0;
    var km          = trajet ? (trajet.km || 0) : 0;

    minutesConduite += dureeTrajet;
    minutesService  += dureeTrajet;

    if (minutesConduite >= REGLES.PAUSE_CONDUITE_MIN) {
      var hPauseR6 = minutesVersHeure(heureActuelle + dureeTrajet);
      var dureePauseR6 = (pauseServiceFaite && !bonusPauseConduiteUsed) ? REGLES.PAUSE_COURTE_DUREE : REGLES.PAUSE_LONGUE_DUREE;
      if (pauseServiceFaite && !bonusPauseConduiteUsed) bonusPauseConduiteUsed = true;
      pauses.push({ type: 'PAUSE_CONDUITE', heure: hPauseR6, duree: dureePauseR6, raison: 'R6 — après 4h30 de conduite' });
      alertes.push('⚠️ R6 — Pause conduite ' + dureePauseR6 + ' min insérée à ' + hPauseR6);
      heureActuelle  += dureeTrajet + dureePauseR6;
      minutesService += dureePauseR6;
      minutesConduite = 0;

    } else if (minutesService >= REGLES.PAUSE_SERVICE_MIN) {
      var hPauseR7 = minutesVersHeure(heureActuelle + dureeTrajet);
      pauses.push({ type: 'PAUSE_SERVICE', heure: hPauseR7, duree: 30, raison: 'R7 — après 6h de service' });
      alertes.push('⚠️ R7 — Pause service 30 min insérée à ' + hPauseR7);
      heureActuelle     += dureeTrajet + REGLES.PAUSE_COURTE_DUREE;
      minutesService     = 0;
      pauseServiceFaite  = true;

    } else {
      heureActuelle += dureeTrajet;
    }

    var heureArrivee     = minutesVersHeure(heureActuelle);
    var tempsDecharge    = getTempsDecharge(arret.ut || 0);
    var heureDepartArret = minutesVersHeure(heureActuelle + tempsDecharge);

    planning.push({
      index:            index + 1,
      lieu:             arret.lieu,
      km:               km,
      dureeTrajet:      dureeTrajet,
      heureArrivee:     heureArrivee,
      tempsDecharge:    tempsDecharge,
      heureDepartArret: heureDepartArret,
      ut:               arret.ut || 0
    });

    minutesService += tempsDecharge;
    heureActuelle  += tempsDecharge;
    lieuPrecedent   = arret.lieu;
  });

  var trajetRetour = distancier && distancier[lieuPrecedent] ? distancier[lieuPrecedent]['ENTREPOT'] : null;
  var dureeRetour  = trajetRetour ? (trajetRetour.minutes || 0) : 0;
  minutesConduite += dureeRetour;
  heureActuelle   += dureeRetour;

  if (minutesConduite >= REGLES.PAUSE_CONDUITE_MIN) {
    var dureePauseRetour = (pauseServiceFaite && !bonusPauseConduiteUsed) ? REGLES.PAUSE_COURTE_DUREE : REGLES.PAUSE_LONGUE_DUREE;
    alertes.push('⚠️ R6 — Pause conduite ' + dureePauseRetour + ' min nécessaire pendant le retour entrepôt');
    heureActuelle += dureePauseRetour;
  }

  return {
    planning:          planning,
    pauses:            pauses,
    heureRetour:       minutesVersHeure(heureActuelle),
    alertes:           alertes,
    dureeServiceTotal: minutesVersHeure(minutesService)
  };
}

// ────────────────────────────────────────────────────────────
// R9 — LIVRAISON PRODUITS FRAIS (NUIT UNIQUEMENT)
// ────────────────────────────────────────────────────────────

function validerLivraisonFraisNuit(marchandise, heureArrivee, lieu) {
  var m        = String(marchandise || '').toUpperCase().trim();
  var estFrais = MARCHANDISES_FRAIS.indexOf(m) >= 0;

  if (!estFrais) return { valide: true, estFrais: false, message: null, severite: 'NA' };

  var heureMin = heureVersMinutes(heureArrivee);
  if (heureMin === null) {
    return { valide: false, estFrais: true, message: '⚠️ R9 — Heure d\'arrivée invalide pour ' + m + ' à ' + (lieu || '?'), severite: 'ERREUR' };
  }

  if (!estNuit(heureMin)) {
    return {
      valide:   false,
      estFrais: true,
      message:  '🚫 R9 — ' + m + ' livré à ' + heureArrivee + ' à ' + (lieu || '?') + ' : livraison FRAIS interdite de jour (06h00–22h00).',
      severite: 'ERREUR'
    };
  }

  return {
    valide:   true,
    estFrais: true,
    message:  '✅ R9 — ' + m + ' livré de nuit à ' + heureArrivee + ' à ' + (lieu || '?') + ' : conforme.',
    severite: 'OK'
  };
}

function validerTourneeRegleR9(arretsPlanifies, chargementsParArret) {
  var violations = [];
  var conformes  = [];

  arretsPlanifies.forEach(function(arret) {
    var fluxArret = chargementsParArret[arret.lieu] || [];
    fluxArret.forEach(function(flux) {
      var res = validerLivraisonFraisNuit(flux.marchandise, arret.heureArrivee, arret.lieu);
      if (res.estFrais) {
        if (!res.valide) violations.push({ lieu: arret.lieu, marchandise: flux.marchandise, heureArrivee: arret.heureArrivee, message: res.message });
        else conformes.push(res.message);
      }
    });
  });

  return {
    valide:     violations.length === 0,
    violations: violations,
    conformes:  conformes,
    message:    violations.length > 0
      ? '🚫 R9 — ' + violations.length + ' violation(s) livraison frais de jour détectée(s)'
      : '✅ R9 — Toutes les livraisons frais sont planifiées de nuit'
  };
}

// ────────────────────────────────────────────────────────────
// CALCUL DU PLANNING HORAIRE COMPLET (R6 + R7 + R9)
// ────────────────────────────────────────────────────────────

function calculerPlanningTournee(heureDepart, arrets, distMap, reglesDech, chargementsMap, lieuDepart) {
  var planning               = [];
  var pausesInjectees        = [];
  var alertesR6R7            = [];
  var violationsR9           = [];
  var heureActuelle          = heureVersMinutes(heureDepart) || 0;
  var minConduite            = 0;
  var minService             = 0;
  var lieuPrec               = lieuDepart || 'ENTREPOT';
  var pauseServiceFaite      = false;
  var bonusPauseConduiteUsed = false;

  function getTempsDechargeLocal(nbUT) {
    if (reglesDech && reglesDech.length) {
      for (var i = 0; i < reglesDech.length; i++) {
        if (nbUT >= reglesDech[i].min && nbUT <= reglesDech[i].max) return reglesDech[i].temps;
      }
    }
    return getTempsDecharge(nbUT);
  }

  function getDist(de, vers) {
    return distMap[de + '_' + vers] || { km: 0, m: 0 };
  }

  arrets.forEach(function(arret, idx) {
    var dist        = getDist(lieuPrec, arret.lieu);
    var dureeTrajet = dist.m || 0;

    minConduite += dureeTrajet;
    minService  += dureeTrajet;

    if (minConduite >= 270) {
      var hPR6 = minutesVersHeure(heureActuelle + dureeTrajet);
      var dureePauseR6 = (pauseServiceFaite && !bonusPauseConduiteUsed) ? 30 : 45;
      if (pauseServiceFaite && !bonusPauseConduiteUsed) bonusPauseConduiteUsed = true;
      pausesInjectees.push({ type: 'R6_CONDUITE', heure: hPR6, duree: dureePauseR6 });
      alertesR6R7.push('⚠️ R6 — Pause conduite ' + dureePauseR6 + ' min insérée à ' + hPR6 + ' avant arrêt ' + (idx + 1) + ' (' + arret.lieu + ')');
      heureActuelle += dureeTrajet + dureePauseR6;
      minService    += dureePauseR6;
      minConduite    = 0;

    } else if (minService >= 360) {
      var hPR7 = minutesVersHeure(heureActuelle + dureeTrajet);
      pausesInjectees.push({ type: 'R7_SERVICE', heure: hPR7, duree: 30 });
      alertesR6R7.push('⚠️ R7 — Pause service 30 min insérée à ' + hPR7 + ' avant arrêt ' + (idx + 1) + ' (' + arret.lieu + ')');
      heureActuelle    += dureeTrajet + 30;
      minService        = 0;
      pauseServiceFaite = true;

    } else {
      heureActuelle += dureeTrajet;
    }

    var heureArrivee     = minutesVersHeure(heureActuelle);
    var tempsDecharge    = getTempsDechargeLocal(arret.ut || 0);
    var heureDepartArret = minutesVersHeure(heureActuelle + tempsDecharge);
    var fluxArret        = chargementsMap[arret.lieu] || [];
    var alertesR9Arret   = [];

    fluxArret.forEach(function(flux) {
      var res = validerLivraisonFraisNuit(flux.marchandise, heureArrivee, arret.lieu);
      if (res.estFrais && !res.valide) {
        violationsR9.push(res.message);
        alertesR9Arret.push(res.message);
      }
    });

    planning.push({
      index:            idx + 1,
      lieu:             arret.lieu,
      km:               dist.km || 0,
      dureeTrajet:      dureeTrajet,
      heureArrivee:     heureArrivee,
      tempsDecharge:    tempsDecharge,
      heureDepartArret: heureDepartArret,
      ut:               arret.ut || 0,
      alertesR9:        alertesR9Arret,
      conforme:         alertesR9Arret.length === 0
    });

    minService    += tempsDecharge;
    heureActuelle += tempsDecharge;
    lieuPrec       = arret.lieu;
  });

  var distRetour = getDist(lieuPrec, lieuDepart || 'ENTREPOT');
  minConduite   += distRetour.m || 0;
  heureActuelle += distRetour.m || 0;

  if (minConduite >= 270) {
    var dureePauseRetour = (pauseServiceFaite && !bonusPauseConduiteUsed) ? 30 : 45;
    alertesR6R7.push('⚠️ R6 — Pause conduite ' + dureePauseRetour + ' min nécessaire pendant le trajet retour entrepôt');
    heureActuelle += dureePauseRetour;
  }

  return {
    planning:        planning,
    pausesInjectees: pausesInjectees,
    alertesR6R7:     alertesR6R7,
    violationsR9:    violationsR9,
    heureRetour:     minutesVersHeure(heureActuelle),
    estValide:       violationsR9.length === 0
  };
}

// ────────────────────────────────────────────────────────────
// R9/R10 — CONTRAINTES HORAIRES DE LIVRAISON
// ────────────────────────────────────────────────────────────

function validerContraintesLivraison(marchandise, heureArrivee, creneauMagasin) {
  var heureMin = heureVersMinutes(heureArrivee);
  var m        = (marchandise || '').toUpperCase();

  if (MARCHANDISES_FRAIS.indexOf(m) >= 0) {
    if (!estNuit(heureMin)) {
      return { valide: false, message: '⚠️ R9 — ' + m + ' doit être livré de nuit (22h–06h), arrivée prévue à ' + heureArrivee, severite: 'ERREUR' };
    }
    return { valide: true, message: '✅ R9 — Livraison ' + m + ' de nuit OK à ' + heureArrivee, severite: 'OK' };
  }

    if (creneauMagasin) {
    var ouverture = heureVersMinutes(creneauMagasin.ouverture);
    var fermeture = heureVersMinutes(creneauMagasin.fermeture);
    if (ouverture !== null && fermeture !== null) {
      var horsCreneaux;
      if (fermeture < ouverture) {
        // Créneau nocturne enjambant minuit (ex: 22:00 → 05:00)
        // Valide si : après ouverture OU avant fermeture
        horsCreneaux = (heureMin < ouverture && heureMin > fermeture);
      } else {
        // Créneau diurne classique (ex: 06:00 → 13:00)
        horsCreneaux = (heureMin < ouverture || heureMin > fermeture);
      }
      if (horsCreneaux) {
        return {
          valide:   false,
          message:  '⚠️ R10 — Magasin fermé à ' + heureArrivee +
                    ' (ouvert ' + creneauMagasin.ouverture + '–' + creneauMagasin.fermeture + ')',
          severite: 'ERREUR'
        };
      }
    }
  }

  return { valide: true, message: '✅ R10 — Livraison ' + m + ' dans les créneaux à ' + heureArrivee, severite: 'OK' };
}

// ────────────────────────────────────────────────────────────
// R11 — REPRISE DES EMBALLAGES
// ────────────────────────────────────────────────────────────

function validerRepriseEmballages(magasinsActifs, tourneesPropres) {
  var magasinsVisites = {};
  tourneesPropres.forEach(function(tournee) {
    (tournee.arrets || []).forEach(function(arret) { magasinsVisites[arret.lieu] = true; });
  });

  var magasinsSansReprise = magasinsActifs.filter(function(mag) { return !magasinsVisites[mag]; });

  if (magasinsSansReprise.length > 0) {
    return {
      valide:              false,
      magasinsSansReprise: magasinsSansReprise,
      message:             '⚠️ R11 — Emballages non repris : ' + magasinsSansReprise.join(', ') + ' (1 passage flotte propre/jour requis)',
      severite:            'AVERTISSEMENT'
    };
  }

  return { valide: true, magasinsSansReprise: [], message: '✅ R11 — Reprise emballages OK pour tous les magasins', severite: 'OK' };
}

// ────────────────────────────────────────────────────────────
// KPI
// ────────────────────────────────────────────────────────────

function calculerCoutModule(module, kmTotal, minutesTotal) {
  return (parseFloat(module.coutFixe || 0)) +
         (parseFloat(module.coutParKm || 0) * kmTotal) +
         (parseFloat(module.coutParHeure || 0) * minutesTotal / 60);
}

function calculerKPICoutParUT(modules, affretements) {
  var coutTotalPropre = 0, utTotalPropre = 0, coutTotalAffret = 0, utTotalAffret = 0;

  modules.forEach(function(m)     { coutTotalPropre += m.coutCalcule || 0; utTotalPropre += m.utTotal || 0; });
  affretements.forEach(function(a) { coutTotalAffret += a.cout || 0; utTotalAffret += a.ut || 0; });

  var coutTotal = coutTotalPropre + coutTotalAffret;
  var utTotal   = utTotalPropre   + utTotalAffret;

  return {
    coutTotal:       coutTotal,
    coutTotalPropre: coutTotalPropre,
    coutTotalAffret: coutTotalAffret,
    utTotal:         utTotal,
    utTotalPropre:   utTotalPropre,
    utTotalAffret:   utTotalAffret,
    coutMoyenParUT:  utTotal > 0 ? Math.round((coutTotal / utTotal) * 100) / 100 : 0,
    tauxPropre:      utTotal > 0 ? Math.round((utTotalPropre / utTotal) * 100) : 0,
    detail:          { modules: modules.length, affretements: affretements.length }
  };
}

// ────────────────────────────────────────────────────────────
// VALIDATEUR GLOBAL
// ────────────────────────────────────────────────────────────

function validerTournee(params) {
  var flux             = params.flux             || [];
  var capaciteMax      = params.capaciteMax;
  var heureChargement  = params.heureChargement;
  var heureDepart      = params.heureDepart;
  var arrets           = params.arrets           || [];
  var distancier       = params.distancier       || {};
  var creneauxMagasins = params.creneauxMagasins || {};

  var erreurs        = [];
  var avertissements = [];
  var infos          = [];

  var r1 = validerCapaciteRemorque(flux, capaciteMax);
  if (!r1.valide) erreurs.push(r1.message); else infos.push(r1.message);

  var r2 = validerCompatibiliteMarchandises(flux);
  if (!r2.valide) erreurs.push(r2.message); else infos.push(r2.message);

  if (heureChargement) {
    var r3 = validerContraintesChargement(flux, heureChargement);
    if (!r3.valide) erreurs.push(r3.message); else infos.push(r3.message);
  }

  var planning = null;
  if (heureDepart && arrets.length && distancier) {
    var planningResult = calculerPlanningAvecPauses(heureDepart, arrets, distancier);
    planning = planningResult;
    planningResult.alertes.forEach(function(a) { avertissements.push(a); });

        // Registre local pour détecter les chevauchements inter-tournées
    // (alimenté par les plages déjà connues dans creneauxMagasins si disponible)
    var registreLocal = creerRegistreOccupation();

    planningResult.planning.forEach(function(arret) {
      var fluxArret      = flux.filter(function(f) { return f.magasin === arret.lieu; });
      var heureArriveeMin = heureVersMinutes(arret.heureArrivee);
      var tempsDechargeA  = arret.tempsDecharge || getTempsDecharge(arret.ut || 0);
      var heureFinMin     = heureArriveeMin + tempsDechargeA;

      // Vérification chevauchement sur ce registre local (même tournée, arrêts multiples)
      var dispCheck = magasinDisponible(
        arret.lieu,
        heureArriveeMin,
        heureFinMin,
        registreLocal,
        params.tourneeId || 'COURANTE'
      );
      if (!dispCheck.disponible) {
        erreurs.push(
          '⚠️ R_OVERLAP — ' + arret.lieu +
          ' déjà occupé de ' + dispCheck.conflit.debut +
          ' à ' + dispCheck.conflit.fin +
          ' (tournée ' + dispCheck.conflit.tourneeId + ')'
        );
      }

      // Enregistrer cette plage dans le registre local
      enregistrerOccupation(
        arret.lieu,
        heureArriveeMin,
        heureFinMin,
        params.tourneeId || 'COURANTE',
        registreLocal
      );

      // Validation créneaux et R9/R10
      fluxArret.forEach(function(f) {
        var rv = validerContraintesLivraison(f.marchandise, arret.heureArrivee, creneauxMagasins[arret.lieu]);
        if (!rv.valide) erreurs.push(rv.message); else infos.push(rv.message);
      });
    });
  }

  return {
    estValide:      erreurs.length === 0,
    erreurs:        erreurs,
    avertissements: avertissements,
    infos:          infos,
    planning:       planning,
    resume: {
      nbErreurs:        erreurs.length,
      nbAvertissements: avertissements.length,
      utTotal:          r1.utTotal         || 0,
      tauxRemplissage:  r1.tauxRemplissage || 0
    }
  };
}

// ────────────────────────────────────────────────────────────
// CHARGEURS DE DONNÉES — lecture depuis le fichier Excel
// ────────────────────────────────────────────────────────────

// Retourne toutes les données brutes sous forme de tableaux de tableaux,
// identique à ce que retournait getDataRange().getValues() dans Apps Script.
function chargerDonnees() {
  try {
    var wb = ouvrirClasseur();
    function lire(nom) { return lireOngletBrut(wb, nom); }

    return {
      ok:         true,
      flux:       lire(SHEET_FLUX),
      tournees:   lire(SHEET_TOURNEES),
      modules:    lire(SHEET_MODULES),
      lieux:      lire(SHEET_LIEUX),
      distancier: lire(SHEET_DISTANCIER),
      plages:     lire(SHEET_PLAGES),
      offsets:    lire(SHEET_OFFSETS),
      ordre:      lire(SHEET_ORDRE),
      dech:       lire(SHEET_DECH),
      chaines:    lire(SHEET_CHAINES),
      pauses:     lire(SHEET_PAUSES),
      chargements:lire(SHEET_CHARGEMENTS)
    };
  } catch (e) {
    return { ok: false, erreur: e.message };
  }
}

// Distancier sous forme de tableau aplati [{f, t, km, m}]
function lireDistancier(wb) {
  return lireOngletBrut(wb, SHEET_DISTANCIER).slice(1).map(function(row) {
    return { f: String(row[0] || ''), t: String(row[1] || ''), km: parseFloat(row[2]) || 0, m: parseFloat(row[3]) || 0 };
  });
}

// Règles de déchargement [{min, max, temps}]
function lireReglesDech(wb) {
  return lireOngletBrut(wb, SHEET_DECH).slice(1).map(function(row) {
    return { min: parseFloat(row[0]) || 0, max: parseFloat(row[1]) || 0, temps: parseFloat(row[2]) || 0 };
  });
}

// Chargements groupés par tournée : { tourneeId: [{arr, ut, marchandises, ...}] }
function lireChargements(wb) {
  var data = lireOngletBrut(wb, SHEET_CHARGEMENTS);
  var map  = {};

  // Structure onglet Chargements :
  // [0]Tournée [1]Zone Entrepôt [2]Entrepôt [3]Magasin [4]UT [5]Reprise Emballage [6]Marchandises [7]FluxId
  data.slice(1).forEach(function(row) {
    var tourneeId   = row[0] ? String(row[0]) : null;
    var magasin     = row[3] ? String(row[3]) : null;
    var ut          = parseFloat(row[4]) || 0;
    var marchandise = row[6] ? String(row[6]) : null;

    if (!tourneeId || !magasin) return;
    if (!map[tourneeId]) map[tourneeId] = [];

    var existant = null;
    for (var i = 0; i < map[tourneeId].length; i++) {
      if (map[tourneeId][i].arr === magasin) { existant = map[tourneeId][i]; break; }
    }

    if (existant) {
      existant.ut += ut;
      if (marchandise && existant.marchandises.indexOf(marchandise) < 0) existant.marchandises.push(marchandise);
    } else {
      map[tourneeId].push({
        arr:          magasin,
        ut:           ut,
        marchandises: marchandise ? [marchandise] : [],
        entrepot:     row[2] ? String(row[2]) : null,
        repriseEmb:   row[5] ? String(row[5]) : 'Non',
        fluxId:       row[7] ? String(row[7]) : null
      });
    }
  });

  return map;
}

// Tournées [{id, capacite, retour, adminMin, chgtMin, repriseEmballage, zone, jour}]
function lireTournees(wb) {
  return lireOngletBrut(wb, SHEET_TOURNEES).slice(1).map(function(row) {
    return {
      id:              String(row[0] || ''),
      capacite:        parseFloat(row[1]) || 33,
      retour:          String(row[2] || 'ENTREPOT'),
      adminMin:        parseFloat(row[3]) || 0,
      chgtMin:         parseFloat(row[4]) || 0,
      repriseEmballage:String(row[5] || 'Non'),
      zone:            String(row[6] || ''),
      jour:            String(row[7] || '')
    };
  });
}

// Offsets { cle: valeurMinutes }
function lireOffsets(wb) {
  var map = {};
  lireOngletBrut(wb, SHEET_OFFSETS).slice(1).forEach(function(row) {
    var cle = row[0] ? String(row[0]) : null;
    if (cle) map[cle] = parseFloat(row[1]) || 0;
  });
  return map;
}

// Distancier imbriqué pour calculerPlanningAvecPauses : { De: { Vers: { km, minutes } } }
function chargerDistancier(wb) {
  var distancier = {};
  lireOngletBrut(wb, SHEET_DISTANCIER).slice(1).forEach(function(row) {
    var de      = row[0] ? String(row[0]) : null;
    var vers    = row[1] ? String(row[1]) : null;
    var km      = parseFloat(row[2]) || 0;
    var minutes = parseFloat(row[3]) || 0;
    if (de && vers) {
      if (!distancier[de]) distancier[de] = {};
      distancier[de][vers] = { km: km, minutes: minutes };
    }
  });
  return distancier;
}

// Créneaux d'ouverture filtrés par jour : { lieu: { ouverture, fermeture, marchandises } }
function chargerCreneauxMagasins(wb, jour) {
  var creneaux = {};
  lireOngletBrut(wb, SHEET_PLAGES).slice(1).forEach(function(row) {
    var lieu    = row[0] ? String(row[0]) : null;
    var jourRow = row[1] ? String(row[1]) : null;
    if (lieu && jourRow && jourRow.toLowerCase() === (jour || '').toLowerCase()) {
      creneaux[lieu] = {
        ouverture:    row[2] ? String(row[2]) : null,
        fermeture:    row[3] ? String(row[3]) : null,
        marchandises: row[4] ? String(row[4]) : null
      };
    }
  });
  return creneaux;
}

// ────────────────────────────────────────────────────────────
// FONCTIONS MÉTIER PRINCIPALES
// ────────────────────────────────────────────────────────────

function verifierR9Journee(jour) {
  try {
    var wb         = ouvrirClasseur();
    var chargements= lireChargements(wb);
    var tournees   = lireTournees(wb);
    var distancier = lireDistancier(wb);
    var reglesDech = lireReglesDech(wb);
    var offsets    = lireOffsets(wb);

    var distMap = {};
    distancier.forEach(function(d) { distMap[d.f + '_' + d.t] = { km: d.km, m: d.m }; });

    var rapportJournee  = [];
    var totalViolations = 0;

    tournees
      .filter(function(t) { return !jour || t.jour === jour; })
      .forEach(function(tournee) {
        var chargt    = chargements[tournee.id] || [];
        var offsetMin = offsets['M_' + tournee.id] || 0;
        var arrets    = chargt.map(function(c) { return { lieu: c.arr, ut: c.ut }; });

        var chargementsMap = {};
        chargt.forEach(function(c) {
          if (!chargementsMap[c.arr]) chargementsMap[c.arr] = [];
          (c.marchandises || []).forEach(function(m) {
            chargementsMap[c.arr].push({ marchandise: m, ut: c.ut });
          });
        });

        var result = calculerPlanningTournee(
          minutesVersHeure(offsetMin), arrets, distMap, reglesDech, chargementsMap, tournee.retour || 'ENTREPOT'
        );

        if (result.violationsR9.length > 0) {
          totalViolations += result.violationsR9.length;
          rapportJournee.push({ tournee: tournee.id, violations: result.violationsR9, planning: result.planning, heureRetour: result.heureRetour });
        }
      });

    return {
      ok:              true,
      jour:            jour,
      totalViolations: totalViolations,
      estValide:       totalViolations === 0,
      rapport:         rapportJournee,
      message:         totalViolations === 0
        ? '✅ R9 — Aucune violation livraison frais de jour pour le ' + jour
        : '🚫 R9 — ' + totalViolations + ' violation(s) détectée(s) pour le ' + jour
    };
  } catch (e) {
    return { ok: false, erreur: e.message };
  }
}

function validerRegleR9(params) {
  try {
    var wb         = ouvrirClasseur();
    var distancier = lireDistancier(wb);
    var reglesDech = lireReglesDech(wb);

    var distMap = {};
    distancier.forEach(function(d) { distMap[d.f + '_' + d.t] = { km: d.km, m: d.m }; });

    var result = calculerPlanningTournee(
      params.heureDepart,
      params.arrets      || [],
      distMap,
      reglesDech,
      params.chargements || {},
      params.lieuDepart  || 'ENTREPOT'
    );

    return {
      ok:           true,
      tourneeId:    params.tourneeId,
      estValide:    result.estValide,
      violationsR9: result.violationsR9,
      alertesR6R7:  result.alertesR6R7,
      planning:     result.planning,
      heureRetour:  result.heureRetour,
      nbViolations: result.violationsR9.length
    };
  } catch (e) {
    return { ok: false, erreur: e.message, estValide: false };
  }
}

function validerTourneeDepuisUI(params) {
  try {
    var wb               = ouvrirClasseur();
    var distancier       = chargerDistancier(wb);
    var creneauxMagasins = chargerCreneauxMagasins(wb, params.jour);
    return validerTournee(Object.assign({}, params, { distancier: distancier, creneauxMagasins: creneauxMagasins }));
  } catch (e) {
    return { estValide: false, erreurs: ['Erreur système : ' + e.message], avertissements: [], infos: [] };
  }
}

function calculerKPIJour(jour) {
  try {
    var wb           = ouvrirClasseur();
    var coutData     = lireOngletBrut(wb, SHEET_COUTS);
    var jourLower    = (jour || '').toLowerCase();

    var modules = coutData.slice(1)
      .filter(function(row) { return row[0] && String(row[0]).toLowerCase() === jourLower; })
      .map(function(row) { return { id: row[1], coutCalcule: parseFloat(row[2]) || 0, utTotal: parseFloat(row[3]) || 0, kmTotal: parseFloat(row[4]) || 0 }; });

    var affretements = lireOngletBrut(wb, SHEET_AFFRETEMENTS).slice(1)
      .filter(function(row) { return row[0] && String(row[0]).toLowerCase() === jourLower; })
      .map(function(row) { return { id: row[1], cout: parseFloat(row[2]) || 0, ut: parseFloat(row[3]) || 0 }; });

    return calculerKPICoutParUT(modules, affretements);
  } catch (e) {
    return { erreur: e.message };
  }
}

function verifierRepriseEmballagesJour(jour) {
  try {
    var wb        = ouvrirClasseur();
    var fluxData  = lireOngletBrut(wb, SHEET_FLUX);
    var jourLower = (jour || '').toLowerCase();

    var magasinsActifsMap = {};
    fluxData.slice(1).forEach(function(row) {
      var jourFlux = row[7] ? String(row[7]) : '';
      var mag      = row[4] ? String(row[4]) : '';
      if (jourFlux.toLowerCase() === jourLower && mag) magasinsActifsMap[mag] = true;
    });

    var magasinsActifs = Object.keys(magasinsActifsMap);
    var tournees       = lireTournees(wb);
    var ordreData      = lireOngletBrut(wb, SHEET_ORDRE);

    var tourneesPropres = tournees
      .filter(function(t) { return t.repriseEmballage === 'Oui' && (!jour || t.jour === jour); })
      .map(function(t) {
        var arrets = ordreData.slice(1)
          .filter(function(r) { return String(r[0]) === t.id; })
          .map(function(r) { return { lieu: String(r[2]) }; });
        return { id: t.id, arrets: arrets };
      });

    return validerRepriseEmballages(magasinsActifs, tourneesPropres);
  } catch (e) {
    return { erreur: e.message };
  }
}

function sauvegarderPlan(donnees) {
  try {
    ecrireOnglet(SHEET_PLAN, donnees && donnees.length > 0 ? donnees : [[]]);
    return { ok: true, message: 'Plan sauvegardé avec succès.' };
  } catch (e) {
    return { ok: false, erreur: e.message };
  }
}

function diagnosticComplet() {
  var wb      = ouvrirClasseur();
  var rapport = ['=== ONGLETS EXISTANTS ==='];

  wb.SheetNames.forEach(function(nom) {
    var data = lireOngletBrut(wb, nom);
    rapport.push(nom + ' (' + Math.max(0, data.length - 1) + ' lignes de données)');
  });

  rapport.push('\n=== TEST chargerDonnees() ===');
  var result = chargerDonnees();
  if (result.ok) {
    rapport.push('✅ ok:true');
    Object.keys(result).forEach(function(k) {
      if (k !== 'ok') {
        var val = result[k];
        rapport.push('  ' + k + ': ' + (Array.isArray(val) ? val.length + ' lignes' : typeof val));
      }
    });
  } else {
    rapport.push('❌ Erreur: ' + result.erreur);
  }

  var texte = rapport.join('\n');
  console.log(texte);
  return texte;
}

// ────────────────────────────────────────────────────────────
// EXPORTS
// ────────────────────────────────────────────────────────────
module.exports = {
  // Données
  chargerDonnees,
  // Règles métier
  validerCapaciteRemorque,
  validerCompatibiliteMarchandises,
  validerContraintesChargement,
  validerLivraisonFraisNuit,
  validerTourneeRegleR9,
  calculerPlanningAvecPauses,
  calculerPlanningTournee,
  validerContraintesLivraison,
  validerRepriseEmballages,
  calculerCoutModule,
  calculerKPICoutParUT,
  validerTournee,
  // Fonctions principales
  verifierR9Journee,
  validerRegleR9,
  validerTourneeDepuisUI,
  calculerKPIJour,
  verifierRepriseEmballagesJour,
  sauvegarderPlan,
  diagnosticComplet,
  // Contrainte chevauchement magasin
  creerRegistreOccupation,
  magasinDisponible,
  enregistrerOccupation,
  libererOccupation,
  // Utilitaires
  heureVersMinutes,
  minutesVersHeure,
  estNuit,
  estJour,
  getTempsDecharge
};