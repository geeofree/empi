import { Pressable, StyleSheet, Text } from "react-native"
import { Song as SongType } from "../hooks/usePlaylists"
import { colors, getSpacing } from "../style"

export type SongProps = {
  song: SongType
}

function Song(props: SongProps) {
  const { song } = props
  return (
    <Pressable style={styles.container}>
      <Text style={styles.title}>{song.title}</Text>
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
    color: colors.normal.black,
    fontFamily: 'Inter',
  },
  artist: {
    fontSize: getSpacing(4),
    color: colors.bright.black,
    fontFamily: 'Inter',
  }
})

export default Song
