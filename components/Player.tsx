import { Pressable, StyleSheet, Text, View } from "react-native"
import Feather from "@expo/vector-icons/Feather"
import { useAudioPlayback } from "../hooks"
import { colors, getFontSize, getSpacing } from "../style"
import { getPercent, getTimeFromUnixTimestamp } from "../utils/math"

function Player() {
  const {
    mode,
    status,
    song,
    togglePlayback,
    playNext,
    playPrev,
    switchPlaybackMode,
  } = useAudioPlayback()

  if (!(status && song)) return null

  const progress = getPercent(status.positionMillis, status.durationMillis)
  const progressWidth = {
    width: `${progress}%`,
  }

  const duration = getTimeFromUnixTimestamp(status.durationMillis)
  const position = getTimeFromUnixTimestamp(status.positionMillis)

  return (
    <View>
      <View style={styles.textInfo}>
        <Text style={styles.title}>{song.title}</Text>
        <Text style={styles.artist}>{song.artist}</Text>
      </View>

      <View style={styles.timeControls}>
        <Text style={styles.timeText}>{position}</Text>
        <View style={styles.progress}>
          <View style={[styles.progressBar, progressWidth]} />
        </View>
        <Text style={styles.timeText}>{duration}</Text>
      </View>

      <View style={styles.controls}>
        <Pressable style={styles.modeControl} onPress={switchPlaybackMode}>
          <Feather name={mode.icon} color={colors.normal.blue} style={styles.modeIcon} />
          <Text style={styles.modeText}>{mode.name}</Text>
        </Pressable>
        <View style={styles.playControls}>
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
            onPress={() => playNext({ shouldCycle: true })}
          />
        </View>
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

  timeControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: getFontSize(1),
    fontFamily: 'Inter',
  },
  progress: {
    flex: 1,
    height: getSpacing(4),
    backgroundColor: colors.bright.light,
    borderRadius: getSpacing(3),
    borderWidth: 1,
    borderColor: colors.normal.light,
    overflow: "hidden",
    marginHorizontal: getSpacing(2),
  },
  progressBar: {
    backgroundColor: colors.normal.blue,
    height: '100%'
  },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: getSpacing(5),
  },
  modeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: getSpacing(3),
    paddingHorizontal: getSpacing(4),
    borderRadius: getSpacing(2),
    backgroundColor: colors.normal.light,
  },
  modeIcon: {
    fontSize: getFontSize(5),
    paddingRight: getSpacing(3),
  },
  modeText: {
    fontFamily: 'Inter',
    fontSize: getFontSize(2),
    color: colors.bright.black,
  },

  playControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: getFontSize(7),
    paddingHorizontal: getSpacing(2),
  }
})

export default Player
