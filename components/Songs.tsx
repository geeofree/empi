import { FlatList } from "react-native"
import { Song as SongType } from "../types/playlist"
import Song from './Song'

export type SongsProps = {
  songs: SongType[]
  isCurrentSong: (songID: string) => boolean
  onPress: (songID: string) => void
  onLongPress: (songID: string) => void
}

function Songs(props: SongsProps) {
  const { songs, isCurrentSong, onPress, onLongPress } = props

  const getKey = (song: SongType) => song.id
  const renderSongs = ({ item: song }: { item: SongType }) => (
    <Song
      song={song}
      isCurrentSong={isCurrentSong(song.id)}
      onPress={onPress}
      onLongPress={onLongPress}
    />
  )

  return (
    <FlatList
      data={songs}
      renderItem={renderSongs}
      keyExtractor={getKey}
    />
  )
}

export default Songs
