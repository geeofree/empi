import { StyleSheet, Text, View } from "react-native"
import Feather from "@expo/vector-icons/Feather"
import { useAudioPlayback } from "../hooks"
import { colors, getFontSize, getSpacing } from "../style"
import { getPercent } from "../utils/math"

function Player() {
  const { status, song, togglePlayback, playNext, playPrev } = useAudioPlayback()

  if (!(status && song)) return null

  const progress = getPercent(status.positionMillis, status.playableDurationMillis)
  const progressWidth = {
    width: `${progress}%`,
  }

  return (
    <View>
      <View style={styles.textInfo}>
        <Text style={styles.title}>{song.title}</Text>
        <Text style={styles.artist}>{song.artist}</Text>
      </View>

      <View style={styles.progress}>
        <View style={[styles.progressBar, progressWidth]} />
      </View>

      <View style={styles.controls}>
        <Feather
          name="skip-back"
          color={colors.bright.black}
          style={styles.icon}
          onPress={playPrev}
        />
        <Feather
          name={status.isPlaying ? "pause" : "play"}
          style={styles.icon}
          color={colors.normal.blue}
          onPress={togglePlayback}
        />
        <Feather
          name="skip-forward"
          color={colors.bright.black}
          style={styles.icon}
          onPress={playNext}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  textInfo: {
    paddingVertical: getSpacing(5),
  },
  title: {
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: getFontSize(3),
  },
  artist: {
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: getFontSize(2),
    color: colors.bright.black,
  },

  progress: {
    height: getSpacing(4),
    backgroundColor: colors.bright.light,
    borderRadius: getSpacing(3),
    borderWidth: 1,
    borderColor: colors.normal.light,
    overflow: "hidden"
  },
  progressBar: {
    backgroundColor: colors.normal.blue,
    height: '100%'
  },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getSpacing(5),
  },
  icon: {
    fontSize: getFontSize(7),
    paddingHorizontal: getSpacing(2),
  }
})

export default Player
