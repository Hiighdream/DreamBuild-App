import { createNativeStackNavigator } from "@react-navigation/native-stack"
import LoginStack from "../stacks/LoginStack"

const Stack = createNativeStackNavigator()

export const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name='Login' component={LoginStack} />
    </Stack.Navigator>
  )
}