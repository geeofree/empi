import { StyleSheet, Text, View } from "react-native"
import { useEffect } from "react"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import Feather from "@expo/vector-icons/Feather"

import { useAudioPlayback, usePlaylists } from "../hooks"
import { Songs, MiniPlayer, Header } from '../components'
import { AppScreenParams } from "../types/navigation"
import { getFontSize, getSpacing } from "../style"

export type PlaylistProps = NativeStackScreenProps<AppScreenParams, 'Playlist'>

function Playlist(props: PlaylistProps) {
  const { navigation } = props
  const playlists = usePlaylists()
  const playback = useAudioPlayback()
  const playlist = playlists.getCurrentPlaylist()

  const { songs } = playlists.getCurrentPlaylist()

  useEffect(() => {
    playlists.setDefaultPlaylist()
  }, [])

  if (!songs?.length) return <Text>No songs found.</Text>

  const handlePress = (songID: string) => {
    if (playlists.isSelecting) return playlists.toggleSelected(songID)
    if (playback.isCurrentSong(songID)) return navigation.navigate('Playing')
    playback.playAudio(songID)
    navigation.push('Playing')
  }

  const handleSelection = (songID: string) => {
    if (playlists.isSelecting) return
    playlists.toggleSelection()
    playlists.toggleSelected(songID)
  }

  const headerTitle = playlists.isSelecting ? `${playlist.name} (${playlists.selected?.length})` : playlist.name
  const headerRightContent = playlists.isSelecting ? (
    <View style={styles.rightHeaderContent}>
      {playlists.selected?.length === 1 ? (
        <Feather name="edit" style={styles.icons} />
      ): null}
      {playlists.selected && playlists.selected.length > 0 ? (
        <Feather name="trash" style={styles.icons} />
      ) : null}
      <Feather name="x-circle" style={styles.icons} onPress={playlists.toggleSelection} />
    </View>
  ) : null

  return (
    <View style={styles.container}>
      <Header
        left={null}
        title={headerTitle}
        right={headerRightContent}
      />
      <Songs
        songs={songs}
        onPress={handlePress}
        onLongPress={handleSelection}
        isSelecting={playlists.isSelecting}
        isSelected={playlists.isSelected}
        isCurrentSong={playback.isCurrentSong}
      />
      <MiniPlayer />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rightHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icons: {
    fontSize: getFontSize(3),
    paddingHorizontal: getSpacing(2),
  }
})

export default Playlist
