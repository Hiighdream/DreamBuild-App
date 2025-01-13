import { StyleSheet, View } from 'react-native'
import { Provider } from "react-redux"
import { store } from "./reduxStore.js"
import { Router } from './src/routes/Router.jsx'

export default function App() {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <Router />
      </View>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
})