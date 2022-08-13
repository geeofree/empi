import { StyleSheet, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font'
import { Playlist, Playing } from './screens';
import { useEffect } from 'react';
import { useAudioPlayback } from './hooks';

export type AppScreenParams = {
  Playlist: undefined
  Playing: undefined
}

const { Screen, Navigator } = createNativeStackNavigator<AppScreenParams>()

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
});

function App() {
  const [loaded] = useFonts({
    Inter: require('./assets/fonts/Inter-Regular.ttf'),
    InterB: require('./assets/fonts/Inter-SemiBold.ttf'),
  })

  const playback = useAudioPlayback()

  useEffect(() => () => {
    playback.stopPlayback()
  }, [])

  if (!loaded) return null

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Navigator initialRouteName="Playlist">
          <Screen name="Playlist" component={Playlist} />
          <Screen name="Playing" component={Playing} />
        </Navigator>
      </NavigationContainer>
    </View>
  )
}

export default App
