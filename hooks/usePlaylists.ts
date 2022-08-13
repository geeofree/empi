import create from "zustand";
import { set, get } from 'lodash/fp'
import { StorageAccessFramework } from "expo-file-system";
import { useEffect } from "react";

export type Playlists = {
  [key: string]: string[]
}

export type PlaylistStore = {
  playlists: Playlists
  createPlaylist: (playlistName: string) => void
  addToPlayList: (fileOrFiles: string | string[], playlistName: string) => void
}

const usePlaylistStore = create<PlaylistStore>((setState, getState) => ({
  playlists: {},
  createPlaylist: (playlistName: string) => {
    setState(state => {
      const playlist = state.playlists[playlistName]
      if (playlist) return state
      const newState = set<PlaylistStore>(`playlists.${playlistName}`, [], state)
      return newState
    })
  },
  addToPlayList: (fileOrFiles: string | string[], playlistName: string) => {
    setState(state => {
      let playlist = get(`playlists.${playlistName}`, state)

      if (playlist === undefined) {
        getState().createPlaylist(playlistName)
      }

      playlist = get(playlistName, getState().playlists)

      if (playlist.includes(fileOrFiles)) return state

      const newPlaylists = playlist.concat(fileOrFiles)
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

      const audioFiles = fileUris
        .map(fileUri => decodeURIComponent(fileUri))
        .filter(file => file.endsWith('.mp3'))

      playlistStore.addToPlayList(audioFiles, 'all')
    }

    getDefaultPlaylists()
  }, [])

  return playlistStore
}

export default usePlaylists
