import React from "react";
import { StyleSheet, Text, View, Image, TextInput } from "react-native";
import LoginScreen from "./src/screens/LoginScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import NavigationScreen from "./src/navigations/NavigationScreen";
import 'react-native-gesture-handler';
import { useNavigation, NavigationContainer } from '@react-navigation/native';


function App() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <NavigationScreen />
      </NavigationContainer>
      
      {/* <LoginScreen/> */}
      {/* <SignUpScreen/> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
export default App;
