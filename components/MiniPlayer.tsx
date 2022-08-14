import { useNavigation } from "@react-navigation/native"
import { StyleSheet, Text, View, Pressable } from "react-native"
import FeatherIcon from '@expo/vector-icons/Feather'

import { useAudioPlayback } from "../hooks"
import { colors, getFontSize, getSpacing } from "../style"
import { Navigation } from "../App"
import { getPercent } from "../utils/math"

function MiniPlayer() {
  const { song, status, togglePlayback } = useAudioPlayback()
  const navigation = useNavigation<Navigation>()

  if (!(song && status)) return null

  const progress = {
    width: `${getPercent(status?.positionMillis, status?.durationMillis)}%`
  }

  return (
    <Pressable
      style={styles.container}
      onPress={() => navigation.navigate('Playing')}
      android_ripple={styles.ripple}
    >
      <View style={styles.progressBar}>
        <View style={[styles.progress, progress]} />
      </View>
      <View style={styles.content}>
        <View style={styles.leftView}>
          <Text style={styles.title}>{song.title}</Text>
          <Text style={styles.artist}>{song.artist}</Text>
        </View>
        <Pressable onPress={() => togglePlayback()}>
          <View style={styles.rightView}>
            <FeatherIcon
              name={status.isPlaying ? 'pause' : 'play'}
              color={colors.normal.blue}
              size={getFontSize(7)}
            />
          </View>
        </Pressable>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  ripple: {
    color: colors.normal.light
  },
  progressBar: {
    height: getSpacing(3),
    backgroundColor: colors.normal.light,
  },
  progress: {
    position: 'absolute',
    height: '100%',
    backgroundColor: colors.normal.blue,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: getSpacing(4),
  },
  leftView: {
    flex: 3,
    paddingRight: getSpacing(3),
  },
  title: {
    fontSize: getFontSize(3),
    fontFamily: 'Inter',
    color: colors.normal.black,
  },
  artist: {
    fontFamily: 'Inter',
    fontSize: getFontSize(2),
    color: colors.bright.black,
  },
  rightView: {
    flex: 1,
    justifyContent: 'center',
  },
})

export default MiniPlayer
