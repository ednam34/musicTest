const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const bodyParser = require('body-parser');
const port = 8080;
const ejs = require('ejs');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'))
//const hostname = '51.210.149.60';

// Définit le dossier contenant les fichiers statiques

app.use(bodyParser.urlencoded({ extended: true }));
// Lance le serveur
app.listen(port, () => {
  console.log(`Le serveur fonctionne sur le port ${port}`);
});


app.use(express.static(path.join(__dirname, 'public')));

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/alban', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'alban.html'));
});

const request = require('request');
const USER_AGENT = 'MyApplication/1.0.0 (contact@myapp.com)';


function getAlbumCovers(artistName) {
  return new Promise((resolve, reject) => {
    const apiUrl = `https://musicbrainz.org/ws/2/artist/?query=artist:${artistName}&fmt=json`;
    console.log(apiUrl);
    request({
      url: apiUrl,
      headers: {
        'User-Agent': USER_AGENT
      }
    }, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        reject(`Error: ${error || body}`);
        return;
      }
      console.log(JSON.parse(body).artists[0]);
      if (JSON.parse(body).artists[0] === undefined) {
        reject(`Error: ${error || body}`);
        return;
      }
      const artistData = JSON.parse(body).artists[0];
      //console.log(artistData);
      const artistId = artistData.id;
      const artistName = artistData.name;
      console.log(artistId+ " "+ artistName);

      const albumsUrl = `https://musicbrainz.org/ws/2/release/?query=arid:${artistId}&inc=recordings&fmt=json`;
      //console.log(albumsUrl);
      request({
        url: albumsUrl,
        headers: {
          'User-Agent': USER_AGENT
        }
      }, (error, response, body) => {
        if (error || response.statusCode !== 200) {
          reject(`Error: ${error || body}`);
          return;
        }

        const albumData = JSON.parse(body).releases;

        const albumCovers = albumData
          .map(album => {
            const albumTitle = album.title;
            const coverUrl = `https://coverartarchive.org/release/${album.id}/front-500`;
            return {
              title: albumTitle,
              coverUrl: coverUrl,
              artName : artistName
            };
          });
        const albumCoversUnique = albumCovers.filter((album, index, self) =>
          index === self.findIndex((a) => (
          a.title === album.title
          ))
        );

          //console.log(`Album covers for ${artistName}:`);
          //albumCovers.forEach(album => console.log(`${album.title}: ${album.coverUrl}`));
          resolve(albumCoversUnique);
      });

    }); 
  });
}



const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: '49ad7ba70b8e4be78851cdcd044e678e',
  clientSecret: '4440ac6aefb5448b9a21dac1360915c8'
});

async function getAlbums(artistName) {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    console.log('Le jeton d\'accès a été récupéré avec succès !');

    // Sauvegardez le jeton d'accès dans l'instance de l'API Spotify
    spotifyApi.setAccessToken(data.body['access_token']);

    const results = await spotifyApi.searchArtists(artistName);
    const artistId = results.body.artists.items[0].id;
    const albums = await spotifyApi.getArtistAlbums(artistId);

    const albumData = albums.body.items.map(album => {
      const albumTitle = album.name;
      const coverUrl = album.images[0].url;
      return {
        title: albumTitle,
        coverUrl: coverUrl,
        artName: artistName
      };
    });

    return albumData;
  } catch (error) {
    console.log('Une erreur s\'est produite :', error);
    return [];
  }
}


//getAlbumCovers('jazzy-bazz');



app.post('/cover', async (req, res) => {
  // Extraire les données du corps de la requête
  const data = req.body.artistName;

  // Faire quelque chose avec les données
  console.log(data);
  const albumCovers = await getAlbums(data);

  const allcover = albumCovers.filter((album, index, self) =>
  index === self.findIndex((a) => (
  a.title === album.title
  ))
);

  console.log(allcover);

  // Rendre la vue EJS
  res.render('cover', { artistName: data, albumCovers: allcover });
});



