import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyBottomTab from './MyBottomTab';


const Stack = createNativeStackNavigator();

const BottomNavigation = () => {
  return (
    <Stack.Navigator  screenOptions={{headerShown:false}}>
      <Stack.Screen name="MyBottomTab" component={MyBottomTab} />
    </Stack.Navigator>
  )
}

export default BottomNavigation