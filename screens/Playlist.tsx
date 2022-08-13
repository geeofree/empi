import { Text } from "react-native"
import { get } from 'lodash/fp'

import { usePlaylists } from "../hooks"
import { Songs } from '../components'

function Playlist() {
  const { playlists } = usePlaylists()

  const allSongs = get('all', playlists)

  if (!allSongs?.length) return <Text>No songs found.</Text>

  return <Songs songs={allSongs} />
}

export default Playlist
