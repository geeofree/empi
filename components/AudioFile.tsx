import { Pressable, StyleSheet, Text } from "react-native"
import { colors, getSpacing } from "../style"

export type AudioFileProps = {
  file: string
}

function AudioFile(props: AudioFileProps) {
  const { file } = props
  return (
    <Pressable style={styles.container}>
      <Text style={styles.text}>{file}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: getSpacing(4),
    borderBottomWidth: 1,
    borderColor: colors.bright.black,
  },
  text: {
    fontSize: getSpacing(4),
    color: colors.normal.black,
    fontFamily: 'Inter',
  }
})

export default AudioFile
