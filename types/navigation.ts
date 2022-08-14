import { NativeStackNavigationProp } from "@react-navigation/native-stack"

export type AppScreenParams = {
  Playlist: undefined
  Playlists: undefined
  Playing: undefined
  EditSong: { songID: string | null }
}

export type Navigation = NativeStackNavigationProp<AppScreenParams>

