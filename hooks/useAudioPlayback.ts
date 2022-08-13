import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";
import { set } from 'lodash/fp'
import create from "zustand";

export type PlaybackStore = {
  /** The playback status of the file being currently played */
  status: AVPlaybackStatusSuccess | null

  playbackInstance: Audio.Sound | null

  /** Set the playback status */
  setPlaybackStatus: (playbackStatus: AVPlaybackStatus) => void

  /** Set the playback instance */
  setPlaybackInstance: (playbackInstance: Audio.Sound) => void
}

const usePlaybackStore = create<PlaybackStore>((setState) => ({
  status: null,
  playbackInstance: null,
  setPlaybackStatus: (playbackStatus) => {
    setState(state => set('status', playbackStatus, state))
  },
  setPlaybackInstance: (playbackInstance) => {
    setState(state => set('playbackInstance', playbackInstance, state))
  },
}))

function useAudioPlayback() {
  const playback = usePlaybackStore()

  const stopPlayback = async () => {
    if (playback.playbackInstance) {
      await playback.playbackInstance.unloadAsync()
    }
  }

  const playAudio = async (uri: string) => {
    await stopPlayback()
    await Audio.setAudioModeAsync({ staysActiveInBackground: true })
    const { sound } = await Audio.Sound.createAsync({ uri }, undefined, playback.setPlaybackStatus)
    await sound.playAsync()
    playback.setPlaybackInstance(sound)
  }

  return { playAudio, status: playback.status, stopPlayback }
}

export default useAudioPlayback
