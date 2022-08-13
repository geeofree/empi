import { Pressable, StyleSheet, Text } from "react-native"
import { useAudioPlayback } from "../hooks"
import { Song as SongType } from "../hooks/usePlaylists"
import { colors, getSpacing } from "../style"

export type SongProps = {
  song: SongType
  onPress: (uri: string) => void
}

function Song(props: SongProps) {
  const { song, onPress } = props
  const { isCurrentSong } = useAudioPlayback()

  const isPlayingStyle = {
    color: isCurrentSong(song) ? colors.normal.blue : colors.normal.black,
  }

  return (
    <Pressable style={styles.container} onPress={() => onPress(song.id)}>
      <Text style={[styles.title, isPlayingStyle]}>{song.title}</Text>
      <Text style={styles.artist}>{song.artist}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: getSpacing(4),
  },
  title: {
    fontSize: getSpacing(4),
    fontFamily: 'Inter',
  },
  artist: {
    fontSize: getSpacing(4),
    color: colors.bright.black,
    fontFamily: 'Inter',
  }
})

export default Song
