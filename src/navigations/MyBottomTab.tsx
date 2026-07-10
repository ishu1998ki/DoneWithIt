import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from '../screens/Profile';
import Attendance from '../screens/Attendance';
import Calendar from '../screens/Calendar';
import Leaves from '../screens/Leaves';
import { Ionicons } from '@expo/vector-icons';
import Profile from '../screens/Profile';


const Tab = createBottomTabNavigator();

const MyBottomTab = () => {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Attendance':
              iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
              break;
            case 'Calendar':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Leaves':
              iconName = focused ? 'airplane' : 'airplane-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Attendance" component={Attendance} />
      <Tab.Screen name="Calendar" component={Calendar} />
      <Tab.Screen name="Leaves" component={Leaves} />
    </Tab.Navigator>
  )
}

export default MyBottomTab