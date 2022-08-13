import { Text } from "react-native"
import { get } from 'lodash/fp'
import { NativeStackScreenProps } from "@react-navigation/native-stack"

import { useAudioPlayback, usePlaylists } from "../hooks"
import { Songs } from '../components'
import { AppScreenParams } from "../App"

export type PlaylistProps = NativeStackScreenProps<AppScreenParams, 'Playlist'>

function Playlist(props: PlaylistProps) {
  const { navigation } = props
  const { playlists } = usePlaylists()
  const playback = useAudioPlayback()

  const allSongs = get('all', playlists)

  if (!allSongs?.length) return <Text>No songs found.</Text>

  const handlePlayAudio = (uri: string) => {
    playback.playAudio(uri)
    navigation.push('Playing')
  }

  return <Songs songs={allSongs} onPlayAudio={handlePlayAudio} />
}

export default Playlist
