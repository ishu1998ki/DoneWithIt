import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import BottomNavigation from './BottomNavigation';

const Route = () => {
  return (
     <NavigationContainer>
      <BottomNavigation />
    </NavigationContainer>
  )
}

export default Route