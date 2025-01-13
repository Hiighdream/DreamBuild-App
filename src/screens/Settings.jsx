import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Image, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import authService from '../database/AuthService'
import { useDispatch } from "react-redux"
import { signout } from '../app/AuthSlice'
import userServices from '../database/UserService';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const Settings = ({navigation}) => {
  const [editModal, setEditModal] = useState(false)
  const [userData, setUserData] = useState({})
  const [currentUserID, setCurrentUserID] = useState('')
  const [uName, setUName] = useState('')
  const [uLoc, setULoc] = useState('')
  const [uPic, setUPic] = useState(null)
  const [password, setPassword] = useState('')

  const [updated, setUpdated] = useState(false)

  const dispatch = useDispatch()

  const handleLogout = () => {
    authService.SignOut().then(() => {
        dispatch(signout())
        navigation.navigate('Login')
    })
    .catch(e => {
      setEmail('Incorrect email or password')
    })
  }

  useEffect(() => {
    authService.GetCurrentUser().then((resp) => {
      setCurrentUserID(resp.targets[0].userId)
      userServices.Get(resp.targets[0].userId).then((res) => {
        console.log('res', res)
        setUserData({useName: resp.name, location: res.location, userPic: res.pic_url})
      })
    })
  }, [updated])
  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  const handleUserDataUpdate = () => {
    if(uPic || uLoc) {
      userServices.Update(currentUserID, {location: uLoc, pic_url: uPic}).then(() => {
        setEditModal(false)
        setUpdated(true)
      })
    } 
    
    if(uName) {
      authService.UpdateUserName(uName).then(() => {
        setEditModal(false)
        setUpdated(true)
      })
    }

    if(password) {
      authService.UpdatePassword(password).then(() => {
        setEditModal(false)
        setUpdated(true)
      })
    }
    
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image
        source={require('../../assets/membership-bg.png')}
        style={{position: 'absolute', zIndex: -10, width: screenWidth, height: screenHeight}}
      />
      <View>

        <View style={{display: editModal ? 'block' : 'none', width: screenWidth, height: screenHeight, position: 'absolute', zIndex: 10, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff4a'}}>
          <View
            style={{width: '80%', height: '35%', borderRadius: 10, boxShadow: '-5px 25px 50px -12px #00000040', backgroundColor: '#fff'}}
          >
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, height: '15%'}}>
              <Text style={{fontSize: 20, fontWeight: '600'}}>Edit Details</Text>
              <View>
                <TouchableOpacity
                  onPress={() => setEditModal(false)}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={25}
                    color={'#0000008f'}
                    style={{padding: 5}}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{padding: 15, height: '60%'}}>
              <TextInput
                placeholder='Name'
                onChangeText={newText => setUName(newText)}
                style={{borderWidth: 1, paddingHorizontal: 10, borderRadius: 5}}
                defaultValue={uName}
              />
              <TextInput
                placeholder='Location'
                onChangeText={newText => setULoc(newText)}
                style={{borderWidth: 1, paddingHorizontal: 10, borderRadius: 5, marginVertical: 10}}
                defaultValue={uLoc}
              />
              <TextInput
                placeholder='Password'
                onChangeText={newText => setPassword(newText)}
                style={{borderWidth: 1, paddingHorizontal: 10, borderRadius: 5}}
                defaultValue={password}
              />
            </View>

            <View
              style={{height: '20%', alignItems: 'flex-end', paddingHorizontal: 10, marginTop: 10}}
            >
              <TouchableOpacity
                style={{width: 100, backgroundColor: '#000', borderRadius: 5, paddingVertical: 10}}
                onPress={handleUserDataUpdate}
              >
                <Text style={{textAlign: 'center', color: '#fff'}}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={{marginBottom: 100}}>
          <TouchableOpacity onPress={() => ('')} style={{flexDirection: 'row'}}>
            {
              userData.userPic === null ? (
                <View style={{width: 100, height: 100, backgroundColor: '#aaa7a7', borderRadius: 999, margin: 'auto', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                  <MaterialCommunityIcons name='account' color={'#fff'} size={70} />
                </View>
              ) : (
                <Image source={{ uri: userData.userPic }} />
              )
            }
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: screenWidth, paddingHorizontal: 20, alignItems: 'center'}}>
          <View>
            <Text style={{color: '#fff', fontSize: 25}}>{userData.useName}</Text>
            <Text style={{color: '#fff', fontSize: 25}}>{userData.location}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setEditModal(true)}
            style={{backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 5}}>
            <Text style={{fontSize: 20}}>EDIT</Text>
          </TouchableOpacity>
        </View>
        <View style={{padding: 20}}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
            style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10}}
          >
            <MaterialCommunityIcons name='bell' color={'#fff'} size={18} />
            <Text
              style={{color: '#fff', fontSize: 18, marginHorizontal: 10}}
            >
              Notifications
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Garage')}
            style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10}}
          >
            <MaterialCommunityIcons name='garage' color={'#fff'} size={20} />
            <Text
              style={{color: '#fff', fontSize: 18, marginHorizontal: 10}}
            >
              Garage
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10}}
          >
            <MaterialIcons name='privacy-tip' color={'#fff'} size={18} />
            <Text
              style={{color: '#fff', fontSize: 18, marginHorizontal: 10}}
            >
              Privacy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10}}
          >
            <MaterialIcons name='help' color={'#fff'} size={18} />
            <Text
              style={{color: '#fff', fontSize: 18, marginHorizontal: 10}}
            >
              Help
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10}}
          >
            <MaterialIcons name='logout' color={'#fff'} size={18} />
            <Text
              style={{color: '#fff', fontSize: 18, marginHorizontal: 10}}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({

})