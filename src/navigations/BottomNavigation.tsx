import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyBottomTab from './MyBottomTab';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import RequestLeave from '../screens/RequestLeave';


const Stack = createNativeStackNavigator();

const BottomNavigation = () => {
  return (
    <Stack.Navigator  screenOptions={{headerShown:false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="MyBottomTab" component={MyBottomTab} />
      <Stack.Screen
        name="RequestLeave"
        component={RequestLeave}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  )
}

export default BottomNavigation