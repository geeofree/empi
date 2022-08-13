import { StyleSheet, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font'

import { AllSongs } from './screens';

const { Screen, Navigator } = createNativeStackNavigator()

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

  if (!loaded) return null

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Navigator initialRouteName="All Songs">
          <Screen name="All Songs" component={AllSongs} />
        </Navigator>
      </NavigationContainer>
    </View>
  )
}

export default App
