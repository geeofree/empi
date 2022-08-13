import { StyleSheet, View, ScrollView, Dimensions, Text } from "react-native"
import Feather from "@expo/vector-icons/Feather"
import { Header, Player } from "../components"
import { useAudioPlayback } from "../hooks"
import { colors, getSpacing } from "../style"
import { Fragment } from "react"

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    justifyContent: "center",
    padding: getSpacing(4),
    flex: 1,
  },
  cover: {
    width: '100%',
    height: Dimensions.get('window').height / 2,
    backgroundColor: colors.normal.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: Dimensions.get('window').width * 0.3,
    color: colors.bright.black,
  },
  coverText: {
    fontFamily: 'Inter',
    color: colors.bright.black,
  },
})

const defaultAlbumCover = (
  <Fragment>
    <Feather name="music" style={styles.icon} />
    <Text style={styles.coverText}>No Album Cover</Text>
  </Fragment>
)

function Playing() {
  const { status, song } = useAudioPlayback()

  if (!(status && song)) return null

  return (
    <View style={styles.container}>
      <Header title="Playing" />
      <ScrollView>
        <View style={styles.content}>
          <View style={styles.cover}>{defaultAlbumCover}</View>
          <Player />
        </View>
      </ScrollView>
    </View>
  )
}

export default Playing
