import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Text } from "react-native"
import { AppScreenParams } from "../App"

export type PlaylistsProps = NativeStackScreenProps<AppScreenParams, 'Playlist'>

function Playlists(props: PlaylistsProps) {
  const { navigation } = props
  return <Text>Hello Playlists!</Text>
}

export default Playlists
