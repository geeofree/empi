import { Pressable, StyleSheet, Text } from "react-native"
import { colors, getSpacing } from "../style"
import { Song as SongType } from "../types/playlist"

export type SongProps = {
  song: SongType
  isCurrentSong: boolean
  onPress: (songID: string) => void
  onLongPress: (songID: string) => void
}

function Song(props: SongProps) {
  const { song, isCurrentSong, onPress, onLongPress } = props

  const isPlayingStyle = {
    color: isCurrentSong ? colors.normal.blue : colors.normal.black,
  }

  return (
    <Pressable
      style={styles.container}
      onPress={() => onPress(song.id)}
      onLongPress={() => onLongPress(song.id)}
      android_ripple={styles.ripple}
    >
      <Text style={[styles.title, isPlayingStyle]}>{song.title}</Text>
      <Text style={styles.artist}>{song.artist}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: getSpacing(4),
  },
  ripple: {
    color: colors.normal.light,
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
