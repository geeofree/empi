import { View, StyleSheet, Text } from "react-native"
import { colors, getSpacing } from "../style"
import { Song as SongType } from "../types/playlist"

export type SongProps = {
  song: SongType
  isCurrentSong: boolean
}

function Song(props: SongProps) {
  const { song, isCurrentSong } = props

  const isPlayingStyle = {
    color: isCurrentSong ? colors.normal.blue : colors.normal.black,
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, isPlayingStyle]}>{song.title}</Text>
      <Text style={styles.artist}>{song.artist}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
