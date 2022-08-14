import { Pressable, FlatList, StyleSheet } from "react-native"
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

import { colors, getFontSize, getSpacing } from "../style"
import { Song as SongType } from "../types/playlist"
import Song from './Song'

export type SongsProps = {
  songs: SongType[]
  isCurrentSong: (songID: string) => boolean
  isSelecting: boolean
  isSelected: (songID: string) => boolean | undefined
  onPress: (songID: string) => void
  onLongPress: (songID: string) => void
}

function Songs(props: SongsProps) {
  const { songs, isCurrentSong, isSelected, isSelecting, onPress, onLongPress } = props

  const getKey = (song: SongType) => song.id
  const renderSongs = ({ item: song }: { item: SongType }) => (
    <Pressable
      style={styles.container}
      onPress={() => onPress(song.id)}
      onLongPress={() => onLongPress(song.id)}
      android_ripple={styles.ripple}
      delayLongPress={300}
    >
      {isSelecting ? (
        <MaterialIcons
          name={isSelected(song.id) ? "check-box" : "check-box-outline-blank"}
          style={[styles.checkbox, isSelected(song.id) ? styles.checkboxSelected : null]}
        />
      ) : null}
      <Song song={song} isCurrentSong={isCurrentSong(song.id)} />
    </Pressable>
  )

  return (
    <FlatList
      data={songs}
      renderItem={renderSongs}
      keyExtractor={getKey}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    padding: getSpacing(4),
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    fontSize: getFontSize(3),
    paddingRight: getSpacing(4),
    color: colors.bright.black,
  },
  checkboxSelected: {
    color: colors.normal.blue,
  },
  ripple: {
    color: colors.normal.light,
  },
})

export default Songs
