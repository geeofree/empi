import create from "zustand";
import { set, get, uniq } from 'lodash/fp'
import { StorageAccessFramework } from "expo-file-system";
import 'react-native-get-random-values'
import { nanoid } from 'nanoid'
import { CurrentPlaylist, Playlist, PlaylistStore, Song } from "../types/playlist";

export const DEFAULT_PLAYLIST_KEY = 'default'
const DEFAULT_PLAYLIST_NAME = 'All Songs'

function sortSongs(a: Song, b: Song): number {
  if (a.title < b.title) return -1
  if (a.title > b.title) return 1
  return 0
}

const usePlaylistStore = create<PlaylistStore>((setState, getState) => ({
  currentPlaylist: DEFAULT_PLAYLIST_KEY,
  songs: [],
  playlists: {},
  selected: null,
  getCurrentPlaylist: () => {
    const { currentPlaylist, playlists, songs } = getState()
    const playlist = get(currentPlaylist, playlists)
    const playlistSongs = songs
      .filter(song => playlist?.songIDs?.includes(song.id))
      .sort(sortSongs)
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
    .sort(sortSongs)

    const defaultPlaylistSongIDs = songs.map(song => song.id)

    getState().setSongs(songs)
    getState().addToPlayList(defaultPlaylistSongIDs, DEFAULT_PLAYLIST_KEY, DEFAULT_PLAYLIST_NAME)
  },
  toggleSelected: (songID) => {
    setState(state => {
      if (state.selected === null) return state

      const alreadySelectedIndex = state.selected.indexOf(songID)
      const isAlreadySelected = alreadySelectedIndex > -1

      if (isAlreadySelected) {
        const newSelected = state.selected.slice()
        newSelected.splice(alreadySelectedIndex, 1)
        const newState = set('selected', newSelected, state)
        return newState
      }

      const newSelected = state.selected.concat(songID)
      const newState = set('selected', newSelected, state)
      return newState
    })
  },
  toggleSelection: () => setState(state => set('selected', state.selected ? null : [], state))
}))

function usePlaylists() {
  const playlist = usePlaylistStore()
  const isSelecting = playlist.selected !== null && playlist.selected.length >= 0
  const isSelected = (songID: string) => playlist.selected?.includes(songID)
  return { isSelecting, isSelected, ...playlist }
}

export default usePlaylists
