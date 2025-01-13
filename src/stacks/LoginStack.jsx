import { StyleSheet, Text, View, Image, TextInput, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Membership from '../screens/Membership'
import HomeStack from './HomeStack'

import authService from '../database/AuthService'
import { useDispatch } from "react-redux"
import { signin } from '../app/AuthSlice'

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

function LoginScreen({navigation}) {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    const user = { email, password }
    try {
      const session = await authService.SignIn(user)
      if(session) {
        const userData = await authService.GetCurrentUser()
        if(userData) {
          dispatch(signin(userData))
          navigation.navigate('Garage')
        }
      }
      else (
        setError('Invalid Username or Password Please Try Again for Contact Dev Team')
      )
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <View>
      <Image
        style={styles.carBackGroundImage}
        source={require('../../assets/DG024_040CH_815.png')}
      />
      <View style={styles.container}>

        <TouchableOpacity
          onPress={() => navigation.navigate('Membership')}
          style={styles.membershipBtn}
        >
          <Text style={styles.textColor}>Create a Membership</Text>
        </TouchableOpacity>
        
        <View style={styles.loginContainer}>
          <TextInput
            placeholder='Username'
            style={styles.inputField}
            keyboardType='email-address'
            require
            onChangeText={newText => setEmail(newText)}
            defaultValue={email}
          />

          <TextInput
            placeholder='Password'
            style={[styles.inputField, {marginTop: 12}]}
            keyboardType='ascii-capable'
            secureTextEntry={true}
            require
            onChangeText={newText => setPassword(newText)}
            defaultValue={password}
          />

          <TouchableOpacity
            onPress={handleLogin}
            style={{backgroundColor: '#0f70e6', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 9999, marginVertical: 20, width: screenWidth/1.97, alignItems: 'center'}}
          >
            <Text style={styles.textColor}>Login</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
            onPress={() => navigation.navigate('GuestEntrance')}
        style={{width: screenWidth/1.5, alignItems: 'center', backgroundColor: '#0f70e6', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 9999, marginVertical: 50, marginHorizontal: 'auto'}}>
          <Text style={styles.textColor}>Guest Entrance</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function MembershipScreen() {
  return <Membership sn="Garage" />
}

function GuestEntranceScreen() {
  return <HomeStack sn="PartPicker" />
}

function GarageScreen() {
  return <HomeStack sn="Garage" />
}

const Stack = createNativeStackNavigator()

export default function LoginStack() {
  return (
    <Stack.Navigator initialRouteName="Login" style={{width: screenWidth, height: screenHeight}}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Membership"
        component={MembershipScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="GuestEntrance"
        component={GuestEntranceScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Garage"
        component={GarageScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  carBackGroundImage: {
    position: 'absolute',
    width: 400,
    height: 250,
    right: 1
  },
  container: {
    backgroundColor: '#0009',
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'flex-end'
  },
  membershipBtn: {
    width: screenWidth/1.5,
    alignItems: 'center',
    backgroundColor: '#0f70e6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999,
    marginVertical: 50,
    marginHorizontal: 'auto'
  },
  textColor: {
    color: '#fff'
  },
  loginContainer: {
    width: screenWidth,
    height: screenHeight/4,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30
  },
  inputField: {
    width: screenWidth/1.25,
    backgroundColor:'#fff',
    borderWidth: 1,
    borderColor: '#000',
    color: '#000',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 9999
  }
})