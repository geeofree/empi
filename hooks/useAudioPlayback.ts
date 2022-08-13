import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";
import { set } from 'lodash/fp'
import create from "zustand";
import usePlaylists, { Song } from "./usePlaylists";

export type PlaybackStore = {
  /** The current song being played */
  song: Song | null

  /** The playback status of the file being currently played */
  status: AVPlaybackStatusSuccess | null

  /** The current playback instance */
  playbackInstance: Audio.Sound | null

  /** Set the playback status */
  setSong: (song: Song) => void

  /** Set the playback status */
  setPlaybackStatus: (playbackStatus: AVPlaybackStatus) => void

  /** Set the playback instance */
  setPlaybackInstance: (playbackInstance: Audio.Sound) => void
}

const usePlaybackStore = create<PlaybackStore>((setState) => ({
  song: null,
  status: null,
  playbackInstance: null,
  setSong: (song) => {
    setState(state => set('song', song, state))
  },
  setPlaybackStatus: (playbackStatus) => {
    setState(state => set('status', playbackStatus, state))
  },
  setPlaybackInstance: (playbackInstance) => {
    setState(state => set('playbackInstance', playbackInstance, state))
  },
}))

const DEFAULT_SONG = {
  uri: '',
  id: '',
  title: '',
  artist: '',
}

function useAudioPlayback() {
  const playback = usePlaybackStore()
  const playlist = usePlaylists()

  const stopPlayback = async () => {
    if (playback.playbackInstance) {
      await playback.playbackInstance.unloadAsync()
    }
  }

  const playAudio = async (songID: string) => {
    await stopPlayback()
    await Audio.setAudioModeAsync({ staysActiveInBackground: true })
    const song = playlist.songs.find(song => song.id === songID) || DEFAULT_SONG
    playback.setSong(song)
    const { sound } = await Audio.Sound.createAsync({ uri: song.uri }, undefined, playback.setPlaybackStatus)
    await sound.playAsync()
    playback.setPlaybackInstance(sound)
  }

  const togglePlayback = async () => {
    const { playbackInstance, status } = playback
    if (!(playbackInstance && status)) return
    await playbackInstance.setStatusAsync({ shouldPlay: !status.isPlaying })
  }

  const isCurrentSong = (song: Song) => song.id === playback?.song?.id

  const playNext = () => {
    const { getCurrentPlaylist } = playlist
    const { song } = playback

    if (!song) return

    const { songIDs } = getCurrentPlaylist()
    const currentSongIdx = songIDs.findIndex(songID => song.id === songID)
    const nextSongIdx = (currentSongIdx + 1) % songIDs.length

    const nextSongID = songIDs[nextSongIdx]

    playAudio(nextSongID)
  }

  const playPrev = () => {
    const { getCurrentPlaylist } = playlist
    const { song } = playback

    if (!song) return

    const { songIDs } = getCurrentPlaylist()
    const currentSongIdx = songIDs.findIndex(songID => song.id === songID)
    let prevSongIdx = (currentSongIdx - 1)
    prevSongIdx = prevSongIdx < 0 ? songIDs.length - 1 : prevSongIdx

    const prevSongID = songIDs[prevSongIdx]

    playAudio(prevSongID)
  }

  return {
    isCurrentSong,
    playAudio,
    playNext,
    playPrev,
    status: playback.status,
    stopPlayback,
    song: playback.song,
    togglePlayback,
  }
}

export default useAudioPlayback
