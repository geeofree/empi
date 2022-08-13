import { Text } from "react-native"
import { useAudioPlayback } from "../hooks"

function Playing() {
  const playback = useAudioPlayback()

  if (!playback.status) return <Text>Loading Song</Text>

  let progress = playback.status.playableDurationMillis ? playback.status.positionMillis / playback.status.playableDurationMillis : 0
  progress = progress * 100

  return <Text style={{ padding: 16 }}>{progress}%</Text>
}

export default Playing
