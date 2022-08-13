import create from "zustand";
import { set, get } from 'lodash/fp'
import { StorageAccessFramework } from "expo-file-system";
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'

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
  playlists: Playlists
  setSongs: (songs: Song[]) => void
  createPlaylist: (playlistKey: string, playlistName: string) => void
  addToPlayList: (songIDs: string[], playlistKey: string, playlistName: string) => void
  setDefaultPlaylist: () => void
  getCurrentPlaylist: () => CurrentPlaylist
  setCurrentPlaylist: (playlistKey: string) => void
}

export const DEFAULT_PLAYLIST_KEY = 'default'
const DEFAULT_PLAYLIST_NAME = 'All Songs'

const usePlaylistStore = create<PlaylistStore>((setState, getState) => ({
  currentPlaylist: DEFAULT_PLAYLIST_KEY,
  songs: [],
  playlists: {},
  getCurrentPlaylist: () => {
    const { currentPlaylist, playlists, songs } = getState()
    const playlist = get(currentPlaylist, playlists)
    const playlistSongs = songs
      .filter(song => playlist?.songIDs?.some(songID => song.id === songID))
      .sort((a, b) => {
        if (a.title < b.title) return -1
        if (a.title > b.title) return 1
        return 0
      })
    const value = set<CurrentPlaylist>('songs', playlistSongs, playlist)
    return value
  },
  setCurrentPlaylist: (playlistKey) => {
    setState(state => set('currentPlaylist', playlistKey, state))
  },
  setSongs: (songs) => {
    setState(state => set('songs', songs, state))
  },
  createPlaylist: (playlistKey, playlistName) => {
    setState(state => {
      const playlist = get(playlistKey, state.playlists)
      if (playlist) return state
      const DEFAULT_PLAYLIST: Playlist = { name: playlistName, songIDs: [] }
      const newState = set<PlaylistStore>(`playlists.${playlistKey}`, DEFAULT_PLAYLIST, state)
      return newState
    })
  },
  addToPlayList: (songIDs, playlistKey, playlistName) => {
    setState(state => {
      let playlist = get(playlistKey, state.playlists)

      if (!playlist) {
        getState().createPlaylist(playlistKey, playlistName)
      }

      playlist = get(playlistKey, getState().playlists)

      const newPlaylistSongs = playlist.songIDs.concat(songIDs)
      const newState = set(`playlists.${playlistKey}.songIDs`, newPlaylistSongs, getState())

      return newState
    })
  },
  setDefaultPlaylist: async () => {
    if (getState().songs.length) return

    const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync()
    if (!permissions.granted) return

    const uri = permissions.directoryUri

    const fileUris = await StorageAccessFramework.readDirectoryAsync(uri)

    const songs = fileUris
    .filter(file => file.endsWith('.mp3'))
    .map(fileUri => ({
      id: nanoid(),
      title: decodeURIComponent(fileUri).replace(/content.+\//, '').replace('.mp3', ''),
      uri: fileUri,
      artist: 'Unknown Artist',
    }))
    .sort((a, b) => {
      if (a.title < b.title) return -1
      if (a.title > b.title) return 1
      return 0
    })

    const defaultPlaylistSongIDs = songs.map(song => song.id)

    getState().setSongs(songs)
    getState().addToPlayList(defaultPlaylistSongIDs, DEFAULT_PLAYLIST_KEY, DEFAULT_PLAYLIST_NAME)
  }
}))

function usePlaylists() {
  const playlist = usePlaylistStore()
  return playlist
}

export default usePlaylists
