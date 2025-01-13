import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Image, StatusBar } from 'react-native';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const Loading = () => {
  const [clouds, setClouds] = useState(true)
  
  useEffect(() => {
    clouds ? (
      setTimeout(() => {
        setClouds(false)
      }, 3000)
    ) : setClouds(true)
  }, [])

  return (
    <View>
      <StatusBar />
      <View style={styles.container}>
        {
          clouds ? (
            <Image
              style={styles.logo}
              source={require('../../assets/cloud_animation.gif')}
            /> 
          ) : (
            <Image
              style={styles.logo}
              source={require('../../assets/DreamBuild.gif')}
            />
          )
        }
      </View>

    </View>
  )
}

export default Loading

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: deviceWidth,
    height: deviceHeight
  }
})