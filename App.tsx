
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React from "react";
import { StyleSheet, Text, View, Image, TextInput } from "react-native";
import LoginScreen from "./src/screens/LoginScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import NavigationScreen from "./src/navigations/NavigationScreen";
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import Route from './src/navigations/Route';


function App(p:any) {
  p.navigation

  return (
    // <GestureHandlerRootView style={{ flex: 1 }}>
    // <View style={styles.container}>
    //   <NavigationContainer>
    //     <NavigationScreen />
    //   </NavigationContainer>
      
    //   {/* <LoginScreen/> */}
    //   {/* <SignUpScreen/> */}
    // </View>
    // </GestureHandlerRootView>
    <Route/>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
export default App;
