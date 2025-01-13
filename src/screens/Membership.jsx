import React, { useState } from 'react'
import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity, TextInput } from 'react-native'
import SwitchButton from 'switch-button-react-native'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons';

import authService from '../database/AuthService'
import { useDispatch } from "react-redux"
import { signin } from '../app/AuthSlice'
import userServices from '../database/UserService';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const DreamerPlanList = [
  {
    "id": 1,
    "name": "Free",
    "desc": "Allows for full access to Parts picker, cart, payments but no garage benefits",
    "price": "0",
    "briefPlane": "Full access to Parts picker. Cart & Payments."
  },
  {
    "id": 2,
    "name": "Silver",
    "desc": "1 bay garage with garage storage, wishlist and recent purchases tab access ",
    "price": "12.99",
    "briefPlane": "1 bay garages. Access to recent wishlist."
  },
  {
    "id": 3,
    "name": "Gold",
    "desc": "Up to 4 bay garages with full access to wishlist, recent purchases, and Discount coupons ",
    "price": "22.99",
    "briefPlane": "Up to 4 bay garages. Full access to wishlist."
  },
  {
    "id": 4,
    "name": "Premium",
    "desc": "Unlimited garages with unlimited access to all benefits listed above plus discount coupons, Free shipping days and VIP Access to any DreamBuild Event or Promotion ",
    "price": "44.99",
    "briefPlane": "Unlimited garages. Unlimited access to all benefits."
  }
]

const builderPlanList = [
  {
    "id": 5,
    "name": "Economy Class",
    "desc": "This is our starter package, up to 45 Parts listings"
  },
  {
    "id": 6,
    "name": "Midsize Class",
    "desc": "Up to 100 parts listed"
  },
  {
    "id": 7,
    "name": "Full Size",
    "desc": "Up to 500 Parts listed. 2nd place listing in parts order"
  },
  {
    "id": 8,
    "name": "Luxury Class",
    "desc": "Unlimited parts listings, Priority in listings, and ad space included"
  }
]

const Membership = ({sn}) => {
  const navigation = useNavigation();

  const dispatch = useDispatch()
  const [isEnabled, setIsEnabled] = useState(false);
  const [purchaseData, setPurchaseData] = useState({})
  const [openCart, setOpenCart] = useState(false)
  const toggleSwitch = () => setIsEnabled(previousState => !previousState)
  const [regiId, setRegiId] = useState(false)
  const [signInModal, setSignInModal] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [location, setLocation] = useState('')

  const handleOnRegister = (cid) => {
    setSignInModal(true)
    setRegiId(cid)
  }

  const handleOnPurchase = async (cid) => {
    let data = {email, password, name}
    try {
      console.log({email, password, name})
      const session = await authService.CreateAccount(data)
      console.log('session', session);
      if (session) {
        const userDataToDB = {userId: session.userId, location}
        userServices.CreateUserDetails(userDataToDB).then(async () => {
          const userData = await authService.GetCurrentUser()
          if(userData) {
            dispatch(signin(userData))
            // console.log(userData)
            setSignInModal(false)
            setOpenCart(true)
            cid <= 4 ? (
              setPurchaseData(DreamerPlanList.filter(e => e.id === cid).pop())
            ) : cid >= 5 (
              setPurchaseData(builderPlanList.filter(e => e.id === cid).pop())
            )
          }
        })
      }
    } catch (error) {
      setError(error.message)
    }
  }
  
  return (
      <View>
        <Image source={require('../../assets/membership-bg.png')} style={{position: 'absolute', width: screenWidth, height: screenHeight}} />

        <View style={{display: signInModal ? 'block' : 'none', width: screenWidth, height: screenHeight, position: 'absolute', zIndex: 10, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff4a'}}>
          <View
            style={{width: '80%', height: '40%', borderRadius: 10, boxShadow: '-5px 25px 50px -12px #00000040', backgroundColor: '#fff'}}
          >
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, height: '15%'}}>
              <Text style={{fontSize: 20, fontWeight: '600'}}>Sign In</Text>
              <View>
                <TouchableOpacity
                  onPress={'handleCloseModal'}
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

            <View style={{padding: 15, height: '65%'}}>
              <TextInput
                placeholder='Name'
                onChangeText={newText => setName(newText)}
                style={{borderWidth: 1, paddingHorizontal: 10, borderRadius: 5}}
                defaultValue={name}
                require
              />
              <TextInput
                placeholder='Email'
                onChangeText={newText => setEmail(newText)}
                style={{borderWidth: 1, paddingHorizontal: 10, borderRadius: 5, marginTop: 10}}
                defaultValue={email}
                require
              />
              <TextInput
                placeholder='Password'
                onChangeText={newText => setPassword(newText)}
                style={{borderWidth: 1, paddingHorizontal: 10, borderRadius: 5, marginVertical: 10}}
                defaultValue={password}
                require
              />
              <TextInput
                placeholder='Location'
                onChangeText={newText => setLocation(newText)}
                style={{borderWidth: 1, paddingHorizontal: 10, borderRadius: 5}}
                defaultValue={location}
              />
            </View>

            <View
              style={{height: '20%', alignItems: 'flex-end', paddingHorizontal: 14, marginTop: 15}}
            >
              <TouchableOpacity
                style={{width: 100, backgroundColor: '#000', borderRadius: 5, paddingVertical: 10}}
                onPress={() => handleOnPurchase(regiId)}
              >
                <Text style={{textAlign: 'center', color: '#fff'}}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {
          !openCart ? (
            <View style={{paddingTop: 10, width: screenWidth, height: screenHeight, alignItems: 'center'}}>
              
              <SwitchButton
                onValueChange={toggleSwitch}
                text1 = {'Dreamers'}
                text2 = {'Builders'}
                switchWidth = {screenWidth/1.1}
                switchHeight = {44}
                switchBorderRadius = {10}
                switchSpeedChange = {500}
                switchBorderColor = {'#d4d4d4'}
                switchBackgroundColor = {'#fff'}
                btnBorderColor = {'#00a4b9'}
                btnBackgroundColor = {'#00bcd4'}
                fontColor = {'#000'}
                activeFontColor = {'#000'}
              />

              <View style={{padding: 20, paddingTop: 0}}>
                {
                  !isEnabled ? (
                    DreamerPlanList.map(({id, name, desc, price}) => (
                      <TouchableOpacity
                        onPress={() => {
                          handleOnRegister(id)
                        }}
                        key={id}
                        style={{borderWidth: 1, borderColor: '#fff', marginTop: 20, borderRadius: 10, padding: 10}}
                      >
                        <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>{name}</Text>
                        <Text style={{color: '#fff', fontSize: 14}}>{desc} {price != 0 ? '$' + price : ''}</Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    builderPlanList.map(({id, name, desc}) => (
                      <TouchableOpacity
                        onPress={() => {
                          handleOnRegister(id)
                        }}
                        key={id}
                        style={{borderWidth: 1, borderColor: '#fff', marginTop: 20, borderRadius: 10, padding: 10}}
                      >
                        <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold'}}>{name}</Text>
                        <Text style={{color: '#fff', fontSize: 14}}>{desc}</Text>
                      </TouchableOpacity>
                    ))
                  )
                }
              </View>
            </View>
          ) : (
            <View style={{width: screenWidth, height: screenHeight}}>
              <View style={{
                flex: 1,
                marginVertical: 20,
                alignItems: 'center',
                height: '16%'
              }}>
                <Image
                  source={require('../../assets/cart-cloud-img.png')}
                  style={{width: 140, height: 90}}
                />
                <Text style={{position: 'absolute', top: 30, fontSize: 20}} >Own It</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  height: '5%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 10
                }}
              >
                <TouchableOpacity
                  onPress={() => setOpenCart(false)}
                  style={{marginLeft: 10}}
                >
                  <MaterialCommunityIcons name='arrow-left' color={'#fff'} size={30} />
                </TouchableOpacity>
                <Text style={{alignItems: 'center', fontSize: 30, color: '#fff', marginHorizontal: 10}}>Cart</Text>
              </View>
              <View
                style={{
                  width: '100%',
                  height:  '77%',
                  alignItems: 'center'
                }}
              >
                <View 
                  style={{
                    width: '90%',
                    padding: 15,
                    backgroundColor: '#fff',
                    borderRadius: 10
                  }}
                >
                  <View style={{flexDirection: 'row'}}>
                    <View style={{marginLeft: 4}}>
                      <Text style={{fontSize: 20, fontWeight: 'bold'}}>Hi, There!</Text>
                      <Text style={{fontSize: 16, fontWeight: '500', marginVertical: 10}}>You Selected {purchaseData.name} Option.</Text>
                    </View>
                  </View>
                  
                  <View style={{boxShadow: '0 25px 50px -12px #00000040', marginHorizontal: -5, marginTop: 8, borderWidth: 1, borderColor: '#00000040', borderRadius: 10, padding: 10, backgroundColor: '#fcf9fa'}}>
                    <View>
                      <View style={{flexDirection: 'row', color: '#0f172b', justifyContent: 'center'}}>
                        <Text style={{fontWeight: 'bold', fontSize: 25}}>${purchaseData.price}</Text>
                        <Text style={{fontWeight: '600', marginHorizontal: 20, marginTop: 6}}>plus local taxes</Text>
                      </View>
                      <TouchableOpacity style={{backgroundColor: '#314158', borderRadius: 5, marginVertical: 10}}
                        onPress={() => navigation.navigate(sn)}>
                        <Text style={{color: '#fff', fontSize: 20, fontWeight: '600', paddingVertical: 10, textAlign: 'center'}}>
                          Get Access
                        </Text>
                      </TouchableOpacity>
                      <Text
                        style={{fontSize: 12, marginTop: 5, textAlign: 'center', fontWeight: '700'}}
                      >
                        {purchaseData.briefPlane}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={{marginTop: 20}}>
                    <Text>{purchaseData.desc}</Text>
                  </View>
                </View>
              </View>
            </View>
          )
        }
      </View>
  )
}

export default Membership

const styles = StyleSheet.create({})