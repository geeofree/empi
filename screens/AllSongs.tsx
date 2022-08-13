import { Text } from "react-native"
import { get } from 'lodash/fp'

import { usePlaylists } from "../hooks"
import { AudioFiles } from '../components'

function AllSongs() {
  const { playlists } = usePlaylists()

  const allSongs = get('all', playlists)

  if (!allSongs?.length) return <Text>No songs found.</Text>

  return <AudioFiles files={allSongs} />
}

export default AllSongs
