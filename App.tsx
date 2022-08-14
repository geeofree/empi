import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font'

import { Playlist, Playlists, Playing } from './screens';
import { useAudioPlayback } from './hooks';

export type AppScreenParams = {
  Playlist: undefined
  Playlists: undefined
  Playing: undefined
}

export type Navigation = NativeStackNavigationProp<AppScreenParams>

const { Screen, Navigator } = createNativeStackNavigator<AppScreenParams>()

function App() {
  const [loaded] = useFonts({
    Inter: require('./assets/fonts/Inter-Regular.ttf'),
    InterB: require('./assets/fonts/Inter-SemiBold.ttf'),
  })

  const { usePlaybackEffect } = useAudioPlayback()
  usePlaybackEffect()

  if (!loaded) return null

  return (
    <NavigationContainer>
      <Navigator initialRouteName="Playlist" screenOptions={{ headerShown: false }}>
        <Screen name="Playlist" component={Playlist} />
        <Screen name="Playlists" component={Playlists} />
        <Screen name="Playing" component={Playing} />
      </Navigator>
    </NavigationContainer>
  )
}

export default App
