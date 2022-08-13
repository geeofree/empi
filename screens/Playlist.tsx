import { StyleSheet, Text, View } from "react-native"
import { useEffect } from "react"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

import { useAudioPlayback, usePlaylists } from "../hooks"
import { AppScreenParams } from "../App"
import { Songs, MiniPlayer } from '../components'

export type PlaylistProps = NativeStackScreenProps<AppScreenParams, 'Playlist'>

function Playlist(props: PlaylistProps) {
  const { navigation } = props
  const playlist = usePlaylists()
  const playback = useAudioPlayback()

  const songs = playlist.getCurrentPlaylist()

  useEffect(() => {
    playlist.setDefaultPlaylist()
  }, [])

  if (!songs?.length) return <Text>No songs found.</Text>

  const handlePlayAudio = (songID: string) => {
    playback.playAudio(songID)
    navigation.push('Playing')
  }

  return (
    <View style={styles.container}>
      <Songs songs={songs} onPlayAudio={handlePlayAudio} />
      <MiniPlayer />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default Playlist
