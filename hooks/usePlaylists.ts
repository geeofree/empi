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
  [key: string]: Song[]
}

export type PlaylistStore = {
  playlists: Playlists
  createPlaylist: (playlistName: string) => void
  addToPlayList: (songOrSongs: Song | Song[], playlistName: string) => void
}

const usePlaylistStore = create<PlaylistStore>((setState, getState) => ({
  playlists: {},
  createPlaylist: (playlistName) => {
    setState(state => {
      const playlist = state.playlists[playlistName]
      if (playlist) return state
      const newState = set<PlaylistStore>(`playlists.${playlistName}`, [], state)
      return newState
    })
  },
  addToPlayList: (songOrSongs, playlistName) => {
    setState(state => {
      let playlist = get(playlistName, state.playlists)

      if (playlist === undefined) {
        getState().createPlaylist(playlistName)
      }

      playlist = get(playlistName, getState().playlists)

      const newPlaylists = uniqBy('title', playlist.concat(songOrSongs))
      const newState = set<PlaylistStore>(`playlists.${playlistName}`, newPlaylists, state)

      return newState
    })
  }
}))

function usePlaylists() {
  const playlistStore = usePlaylistStore()

  useEffect(() => {
    const getDefaultPlaylists = async () => {
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

      playlistStore.addToPlayList(songs, 'all')
    }

    getDefaultPlaylists()
  }, [])

  return playlistStore
}

export default usePlaylists
