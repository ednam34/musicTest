const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const port = 80;
const hostname = '51.210.149.60';

// Définit le dossier contenant les fichiers statiques


// Lance le serveur
app.listen(port,hostname, () => {
  console.log(`Le serveur fonctionne sur le port ${port}`);
});


app.use(express.static(path.join(__dirname, 'public')));

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});