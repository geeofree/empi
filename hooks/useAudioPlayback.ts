import { Audio, AVPlaybackStatus } from "expo-av";
import { set } from 'lodash/fp'
import { useEffect } from "react";
import create from "zustand";

export type PlaybackStore = {
  /** The URI of the file currently being played */
  currentUri: string | null

  /** The playback status of the file being currently played */
  status: AVPlaybackStatus | null

  playbackInstance: Audio.Sound | null

  /** Set the the current URI */
  setCurrentUri: (uri: string) => void

  /** Set the playback status */
  setPlaybackStatus: (playbackStatus: AVPlaybackStatus) => void

  /** Set the playback instance */
  setPlaybackInstance: (playbackInstance: Audio.Sound) => void
}

const usePlaybackStore = create<PlaybackStore>((setState) => ({
  currentUri: null,
  status: null,
  playbackInstance: null,
  setCurrentUri: (uri) => {
    setState(state => set('currentUri', uri, state))
  },
  setPlaybackStatus: (playbackStatus) => {
    setState(state => set('status', playbackStatus, state))
  },
  setPlaybackInstance: (playbackInstance) => {
    setState(state => set('playbackInstance', playbackInstance, state))
  },
}))

function useAudioPlayback() {
  const playback = usePlaybackStore()

  const playAudio = (uri: string) => {
    playback.setCurrentUri(uri)
  }

  const stopPlayback = async () => {
    if (playback.playbackInstance) {
      await playback.playbackInstance.unloadAsync()
    }
  }

  const runPlayback = async (uri: string) => {
    await stopPlayback()
    await Audio.setAudioModeAsync({ staysActiveInBackground: true })
    const { sound } = await Audio.Sound.createAsync({ uri }, undefined, playback.setPlaybackStatus)
    await sound.playAsync()
    playback.setPlaybackInstance(sound)
  }

  useEffect(() => {
    if (playback.currentUri) {
      runPlayback(playback.currentUri)
    }

    return () => { stopPlayback() }
  }, [playback.currentUri])

  return { playAudio }
}

export default useAudioPlayback
