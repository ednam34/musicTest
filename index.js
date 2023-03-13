const express = require('express');
const path = require('path');

const app = express();
const port = 80;
const hostname = '51.210.149.60';

// Définit le dossier contenant les fichiers statiques


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

// Lance le serveur
app.listen(port,hostname, () => {
  console.log(`Le serveur fonctionne sur le port ${port}`);
});


app.use(express.static(path.join(__dirname, 'public')));

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});