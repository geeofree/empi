import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";
import { set } from 'lodash/fp'
import { useEffect } from "react";
import create from "zustand";
import usePlaylists, { Song } from "./usePlaylists";

export const PLAYBACK_MODE_STATE = {
  PLAYLIST: 'PLAYLIST',
  REPEAT_PLAYLIST: 'REPEAT_PLAYLIST',
  REPEAT_SONG: 'REPEAT_SONG',
  SHUFFLE_PLAYLIST: 'SHUFFLE_PLAYLIST',
}

type PlaybackModeIcon = "play" | "repeat" | "play-circle" | "shuffle"
type PlaybackModeName = "Playlist" | "Repeat Playlist" | "Repeat Song" | "Shuffle Playlist"
type PlaybackModeState = keyof typeof PLAYBACK_MODE_STATE

export type PlaybackMode = {
  state: PlaybackModeState
  icon: PlaybackModeIcon
  name: PlaybackModeName
  next: PlaybackModeState
}

export type PlaybackModeMachine = {
  [key in PlaybackModeState]: PlaybackMode
}

export type PlaybackStore = {
  /** The current playback mode */
  mode: PlaybackMode,

  /** The current song being played */
  song: Song | null

  /** The playback status of the file being currently played */
  status: AVPlaybackStatusSuccess | null

  /** The current playback instance */
  playbackInstance: Audio.Sound | null

  /** Set the current song */
  setSong: (song: Song) => void

  /** Set the playback status */
  setPlaybackStatus: (playbackStatus: AVPlaybackStatus) => void

  /** Set the playback instance */
  setPlaybackInstance: (playbackInstance: Audio.Sound) => void

  /** Switches/cycles through the playback modes */
  switchPlaybackMode: () => void
}

const PLAYBACK_MODE: PlaybackModeMachine = {
  PLAYLIST: {
    state: "PLAYLIST",
    icon: "play",
    name: "Playlist",
    next: "REPEAT_PLAYLIST"
  },
  REPEAT_PLAYLIST: {
    state: "REPEAT_PLAYLIST",
    icon: "repeat",
    name: "Repeat Playlist",
    next: "SHUFFLE_PLAYLIST"
  },
  SHUFFLE_PLAYLIST: {
    state: "SHUFFLE_PLAYLIST",
    icon: "shuffle",
    name: "Shuffle Playlist",
    next: "REPEAT_SONG"
  },
  REPEAT_SONG: {
    state: "REPEAT_SONG",
    icon: "play-circle",
    name: "Repeat Song",
    next: "PLAYLIST"
  },
}

const usePlaybackStore = create<PlaybackStore>((setState, getState) => ({
  mode: PLAYBACK_MODE.PLAYLIST,
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
  switchPlaybackMode: () => {
    const { mode } = getState()
    setState(state => set('mode', PLAYBACK_MODE[mode.next], state))
  }
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
    if (status.didJustFinish) {
      await playbackInstance.replayAsync()
    } else {
      await playbackInstance.setStatusAsync({ shouldPlay: !status.isPlaying })
    }
  }

  const isCurrentSong = (songID: string) => songID === playback?.song?.id

  const playNext = (options: { shouldCycle: boolean }) => {
    const { shouldCycle } = options
    const { getCurrentPlaylist } = playlist
    const { song } = playback

    if (!song) return

    const { songIDs } = getCurrentPlaylist()
    const currentSongIdx = songIDs.findIndex(songID => song.id === songID)
    let nextSongIdx = currentSongIdx + 1
    nextSongIdx = shouldCycle ? nextSongIdx % songIDs.length : nextSongIdx

    const nextSongID = songIDs[nextSongIdx]
    if (!nextSongID) return

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

  const replayAudio = async () => {
    const { playbackInstance, status } = playback
    if (!(playbackInstance && status)) return
    if (!status.didJustFinish) return
    await playbackInstance.replayAsync()
  }

  const shufflePlay = () => {
    const { song } = playback
    const { getCurrentPlaylist } = playlist
    const { songIDs } = getCurrentPlaylist()

    if (!song) return

    let nextSongIdx = Math.floor(Math.random() * songIDs.length)
    let nextSongID = songIDs[nextSongIdx]

    if (song.id === nextSongID) {
      nextSongIdx = (nextSongIdx + 1) % songIDs.length
      nextSongID = songIDs[nextSongIdx]
    }

    playAudio(nextSongID)
  }

  const handlePlaybackModes = () => {
    if (!playback.status?.didJustFinish) return

    switch (playback.mode.state) {
      case PLAYBACK_MODE_STATE.REPEAT_SONG:
        replayAudio()
        return

      case PLAYBACK_MODE_STATE.PLAYLIST:
        playNext({ shouldCycle: false })
        return

      case PLAYBACK_MODE_STATE.REPEAT_PLAYLIST:
        playNext({ shouldCycle: true })
        return

      case PLAYBACK_MODE_STATE.SHUFFLE_PLAYLIST:
        shufflePlay()
        return
    }
  }

  const usePlaybackEffect = () => {
    useEffect(handlePlaybackModes, [playback.mode.state, playback.status?.didJustFinish])
    useEffect(() => () => {
      stopPlayback()
    }, [])
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
    mode: playback.mode,
    switchPlaybackMode: playback.switchPlaybackMode,
    usePlaybackEffect,
  }
}

export default useAudioPlayback
