const clientId = "e87bd821015e43b382798204bdabda9c";
const redirectUri = "http://localhost:3000/";
let accessToken = "";
let expiresIn = "";

const Spotify = {
  getAccessToken() {
    if(accessToken) {
      console.log("here");
      return accessToken;
    }
    let urlAccessToken = window.location.href.match(/access_token=([^&]*)/);
    let urlExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
    if (urlAccessToken && urlExpiresIn) {
      accessToken = urlAccessToken[1];
      expiresIn = urlExpiresIn[1];
      window.setTimeout(() => accessToken = "", expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
    }
  },

  search(term) {
    if(!accessToken) {
      Spotify.getAccessToken();
    }
    return fetch(`https://api.spotify.com/v1/search?q=${term}&type=track`,
                {headers: {Authorization: `Bearer ${accessToken}`}})
      .then(response => {return response.json()})
       .then(jsonResponse => {
         if (jsonResponse.tracks) {
           return jsonResponse.tracks.items.map(track => {
             return {
               id: track.id,
               name: track.name,
               artist: track.artists[0].name,
               album: track.album.name,
               uri: track.uri
             };
         });
       } else {
          return [];
       }
   })
 },

 savePlaylist(name, trackUris) {
   if(!accessToken) {
     Spotify.getAccessToken();
   }
   if (!name || !trackUris || trackUris.length === 0) return;
       const userUrl = 'https://api.spotify.com/v1/me';
       const headers = {
         Authorization: `Bearer ${accessToken}`
       };
       let userId = undefined;
       let playlistId = undefined;
       fetch(userUrl, {
         headers: headers
       })
       .then(response => response.json())
       .then(jsonResponse => userId = jsonResponse.id)
       .then(() => {
         const createPlaylistUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;
         fetch(createPlaylistUrl, {
             method: 'POST',
             headers: headers,
             body: JSON.stringify({
               name: name
             })
           })
           .then(response => response.json())
           .then(jsonResponse => playlistId = jsonResponse.id)
           .then(() => {
             const addPlaylistTracksUrl = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
             fetch(addPlaylistTracksUrl, {
               method: 'POST',
               headers: headers,
               body: JSON.stringify({
                 uris: trackUris
               })
             });
           })
       })
     }
}

export default Spotify;
