import React, { Component } from 'react';
import SearchResults from "../SearchResults/SearchResults";
import SearchBar from "../SearchBar/SearchBar";
import Playlist from "../Playlist/Playlist";
import Spotify from "../../util/Spotify";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [
        {name: "",
        artist: "",
        album: "",
        id: ""}
      ],
      playlistName: "",
      playlistTracks: [
        {name: "",
        artist: "",
        album: "",
        id: ""}
      ]
    };
    this.onAdd = this.onAdd.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  onAdd(track) {
    if(!this.state.playlistTracks.find(playlistTrack => playlistTrack.id === track.id)) {
      this.setState(prevState => ({
        playlistTracks: [...prevState.playlistTracks, track]
    }));
  }
}

  onRemove(track) {
    this.setState({
     playlistTracks: this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id)
   });
 }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    const trackUris = this.state.playlistTracks.map(playlistTrack => playlistTrack.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris);
    this.setState({
      searchResults: []
    });
    this.updatePlaylistName("New Playlist");
  }

  onSearch(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults});
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
            <SearchBar onSearch={this.onSearch} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.onAdd}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
