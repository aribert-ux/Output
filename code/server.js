'use strict';
// ============================================================
// Serveur local — remplace Google Apps Script
// Lance avec : node server.js
// Accès : http://localhost:3000/outil_v7.html
// ============================================================

const express = require('express');
const path    = require('path');
const code    = require('./code');

const app  = express();
const PORT = 3000;

// ── Middleware ───────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));

// CORS — autorise Live Preview (port 5500) à appeler ce serveur
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin',  '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Sert les fichiers statiques (HTML, CSS…) depuis ce répertoire
app.use(express.static(__dirname));

// ── Fonctions exposées ───────────────────────────────────────
var FONCTIONS = {
  chargerDonnees:                code.chargerDonnees,
  validerTourneeDepuisUI:        code.validerTourneeDepuisUI,
  verifierR9Journee:             code.verifierR9Journee,
  verifierRepriseEmballagesJour: code.verifierRepriseEmballagesJour,
  calculerKPIJour:               code.calculerKPIJour,
  sauvegarderPlan:               code.sauvegarderPlan,
};

// ── Route API générique ──────────────────────────────────────
// POST /api/<nomFonction>  body: { args: [...] }
app.post('/api/:nom', function(req, res) {
  var nom = req.params.nom;
  var fn  = FONCTIONS[nom];

  if (!fn) {
    return res.status(404).json({ ok: false, erreur: 'Fonction inconnue : ' + nom });
  }

  try {
    var args   = (req.body && req.body.args) || [];
    var result = fn.apply(null, args);
    res.json(result);
  } catch (e) {
    console.error('[API] Erreur dans ' + nom + ':', e.message);
    res.status(500).json({ ok: false, erreur: e.message });
  }
});

// ── Démarrage ────────────────────────────────────────────────
app.listen(PORT, function() {
  console.log('');
  console.log('✅  Serveur démarré');
  console.log('    → Ouvrez : http://localhost:' + PORT + '/outil_v7.html');
  console.log('    → API    : http://localhost:' + PORT + '/api/<fonction>');
  console.log('');
});
