import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PartPicker from '../screens/PartPicker';
import Garage from '../screens/Garage';
import Settings from '../screens/Settings';
import Notifications from '../screens/Notifications';

const Tab = createBottomTabNavigator();

function HomeStack({sn}) {
  return (
    <Tab.Navigator
      initialRouteName={sn}
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { backgroundColor: 'white', height: 70, paddingTop: 10, borderRadius: 10 },
      }}
    >
      <Tab.Screen
        name="PartPicker"
        component={PartPicker}
        options={{
          tabBarLabel: 'Part Picker',
          tabBarActiveTintColor: 'black',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          )
        }}
      />
      <Tab.Screen
        name="Garage"
        component={Garage}
        options={{
          tabBarLabel: 'Garage',
          tabBarActiveTintColor: 'black',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="garage" color={color} size={26} />
        ) }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarLabel: 'Settings',
          tabBarActiveTintColor: 'black',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" color={color} size={26} />
          )
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarLabel: 'Notifications',
          tabBarActiveTintColor: 'black',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="bell" color={color} size={26} />
          )
        }}
      />
    </Tab.Navigator>
  )
};

export default HomeStack;