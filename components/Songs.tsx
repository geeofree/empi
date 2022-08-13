import { FlatList, View } from "react-native"

import { Song as SongType } from "../hooks/usePlaylists"

import Song from './Song'

export type SongsProps = {
  songs: SongType[]
}

function Songs(props: SongsProps) {
  const { songs } = props

  const renderSongs = ({ item: song }: { item: SongType }) => (
    <Song song={song} />
  )

  const getKey = (song: SongType) => song.id

  return (
    <View>
      <FlatList
        data={songs}
        renderItem={renderSongs}
        keyExtractor={getKey}
      />
    </View>
  )
}

export default Songs
