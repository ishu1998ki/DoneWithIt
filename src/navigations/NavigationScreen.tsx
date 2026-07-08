import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import HomePage from "../screens/HomePage";

const Stack = createStackNavigator();

const NavigationScreen = (p:any) => {
  return (
    <Stack.Navigator screenOptions={
        {
          headerShown: false,
        }
      }>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomePage} />
        
      </Stack.Navigator>
  );
};

export default NavigationScreen;
