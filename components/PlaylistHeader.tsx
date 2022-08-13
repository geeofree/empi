import { usePlaylists } from "../hooks"
import Header from './Header'

function PlaylistHeader() {
  const { getCurrentPlaylist } = usePlaylists()
  const playlist = getCurrentPlaylist()

  if (!playlist) return null

  return <Header left={null} title={playlist.name} />
}

export default PlaylistHeader
