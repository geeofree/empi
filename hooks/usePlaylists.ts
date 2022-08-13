import create from "zustand";
import { set, get, uniqBy } from 'lodash/fp'
import { StorageAccessFramework } from "expo-file-system";
import { useEffect } from "react";
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'

export type Song = {
  id: string
  title: string
  artist: string
  uri: string
}

export type Playlists = {
  [key: string]: string[]
}

export type PlaylistStore = {
  currentPlaylist: string
  songs: Song[]
  playlists: Playlists
  setSongs: (songs: Song[]) => void
  createPlaylist: (playlistName: string) => void
  addToPlayList: (songIDs: string[], playlistName: string) => void
  setDefaultPlaylist: () => void
  getCurrentPlaylist: () => Song[]
  setCurrentPlaylist: (playlistName: string) => void
}

export const DEFAULT_PLAYLIST = 'default'

const usePlaylistStore = create<PlaylistStore>((setState, getState) => ({
  currentPlaylist: DEFAULT_PLAYLIST,
  songs: [],
  playlists: {},
  getCurrentPlaylist: () => {
    const { currentPlaylist, playlists, songs } = getState()
    const playlist = get(currentPlaylist, playlists) || []
    const playlistSongs = songs.filter(song => playlist.some(songID => song?.id === songID))
    return playlistSongs
  },
  setCurrentPlaylist: (playlistName) => {
    setState(state => set('currentPlaylist', playlistName, state))
  },
  setSongs: (songs) => {
    setState(state => set('songs', songs, state))
  },
  createPlaylist: (playlistName) => {
    setState(state => {
      const playlist = get(playlistName, state.playlists)
      if (playlist) return state
      const newState = set<PlaylistStore>(`playlists.${playlistName}`, [], state)
      return newState
    })
  },
  addToPlayList: (songIDs, playlistName) => {
    setState(state => {
      let playlist = get(playlistName, state.playlists)

      if (!playlist) {
        getState().createPlaylist(playlistName)
      }

      playlist = get(playlistName, getState().playlists)

      const newPlaylist = playlist.concat(songIDs)
      const newState = set(`playlists.${playlistName}`, newPlaylist, state)

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

    const defaultPlaylistSongIDs = songs.map(song => song.id)

    getState().setSongs(songs)
    getState().addToPlayList(defaultPlaylistSongIDs, DEFAULT_PLAYLIST)
  }
}))

function usePlaylists() {
  const playlist = usePlaylistStore()
  return playlist
}

export default usePlaylists
