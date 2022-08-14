import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av"
import { Song } from "./playlist"

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

