import { Pressable, StyleSheet, Text } from "react-native"

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
    padding: 16,
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 16,
  }
})

export default AudioFile
