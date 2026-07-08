import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../screens/HomePage';
import Attendance from '../screens/Attendance';
import Calendar from '../screens/Calendar';
import Leaves from '../screens/Leaves';


const Tab = createBottomTabNavigator();

const MyBottomTab = () => {
  return (
    <Tab.Navigator screenOptions={{headerShown:false}}>
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Attendance" component={Attendance} />
      <Tab.Screen name="Calendar" component={Calendar} />
      <Tab.Screen name="Leaves" component={Leaves} />
    </Tab.Navigator>
  )
}

export default MyBottomTab