import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Dispatch, SetStateAction, useState } from "react"
import { StyleSheet, Text, View, Button, Alert } from "react-native"
import { Header, Field } from "../components"
import { usePlaylists } from "../hooks"
import { colors, getSpacing } from "../style"
import { AppScreenParams } from "../types/navigation"

export type EditSongProps = NativeStackScreenProps<AppScreenParams, 'EditSong'>

function EditSong(props: EditSongProps) {
  const { navigation, route } = props
  const { songID } = route.params
  const playlists = usePlaylists()
  const song = playlists.getSong(songID)

  const [title, setTitle] = useState(song?.title)
  const [artist, setArtist] = useState(song?.artist)

  let content = <Text>No Song Found.</Text>

  const handleConfirm = () => {
    playlists.toggleSelection()
    navigation.goBack()
  }

  const handleSubmit = () => {
    playlists.updateSong(songID as string, { title, artist } as { title: string, artist: string })
    Alert.alert('Song successfully updated', undefined, [{ text: 'Okay', onPress: handleConfirm }])
  }

  const handleChange = (setState: Dispatch<SetStateAction<string | undefined>>) => (value: string) => {
    setState(value)
  }

  if (song) {
    content = (
      <View style={styles.content}>
        <Field
          labelText="Song Name"
          input={{ value: title, onChangeText: handleChange(setTitle) }}
        />

        <Field
          labelText="Artist"
          input={{ value: artist, onChangeText: handleChange(setArtist) }}
        />

        <Button
          title="Edit Song"
          onPress={handleSubmit}
          color={colors.normal.blue}
        />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Header title="Edit Song" right={null} />
      {content}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: getSpacing(4),
  }
})

export default EditSong
