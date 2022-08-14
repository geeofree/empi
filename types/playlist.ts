export type Song = {
  id: string
  title: string
  artist: string
  uri: string
}

export type Playlist = {
  name: string
  songIDs: string[]
}

export type Playlists = {
  [key: string]: Playlist
}

export type CurrentPlaylist = Playlist & { songs: Song[] }

export type PlaylistStore = {
  currentPlaylist: string
  songs: Song[]
  selected: string[] | null
  playlists: Playlists
  setSongs: (songs: Song[]) => void
  createPlaylist: (playlistKey: string, playlistName: string) => void
  addToPlayList: (songIDs: string[], playlistKey: string, playlistName: string) => void
  setDefaultPlaylist: () => void
  getCurrentPlaylist: () => CurrentPlaylist
  setCurrentPlaylist: (playlistKey: string) => void
  toggleSelected: (songID: string) => void
  toggleSelection: () => void
}
