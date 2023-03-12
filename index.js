const { appendFile } = require('fs');
const http = require('http');
var express = require('express');
var app = express();

const hostname = '51.210.149.60'; // Remplacez cette valeur par l'adresse IP de votre serveur
const port = 8080;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end("Je t'aime Clea\n");
});

server.listen(port, hostname, () => {
  console.log(`Le serveur fonctionne sur http://${hostname}:${port}/`);
});


app.get('/', (req, res) => {
    //go to index.html
    res.sendFile(path.join(__dirname, 'index.html'));
    })