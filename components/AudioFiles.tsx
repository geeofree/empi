import { FlatList, View } from "react-native"
import AudioFile from "./AudioFile"

export type AudioFilesProps = {
  files: string[]
}

function AudioFiles(props: AudioFilesProps) {
  const { files } = props

  const audioFiles = files.map(file => file.replace(/content.+\//, '').replace('.mp3', ''))
  const renderAudioFiles = ({ item }: { item: string }) => <AudioFile file={item} />
  const getKey = (audioFile: string) => audioFile

  return (
    <View>
      <FlatList
        data={audioFiles}
        renderItem={renderAudioFiles}
        keyExtractor={getKey}
      />
    </View>
  )
}

export default AudioFiles
