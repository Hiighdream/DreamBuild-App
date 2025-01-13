import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { AuthStack } from './AuthStack'
import HomeStack from '../stacks/HomeStack'
import Loading from '../screens/Loading'
import { useSelector, useDispatch } from "react-redux"
import authService from "../database/AuthService"
import { StatusBar, Dimensions, View } from 'react-native'

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export const Router = () => {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  const isLoggedIn = useSelector((state) => state.auth.status)

  // useEffect(() => {
  //   authService
  //     .GetCurrentUser()
  //     .then((userData) => {
  //       if (userData) dispatch(signin({ userData }))
  //       else dispatch(signout())
  //     })
  //     // .finally(() => setLoading(false))
  // }, [dispatch])

  setTimeout(() => {
    setLoading(false)
  }, 5000)

  if (loading) {
    return <Loading />
  }

  return (
    <View style={{width: deviceWidth, height: deviceHeight}}>
      <NavigationContainer>
        <StatusBar />
        {
          isLoggedIn ? <HomeStack /> : <AuthStack />
        }
      </NavigationContainer>
    </View>
  )
}