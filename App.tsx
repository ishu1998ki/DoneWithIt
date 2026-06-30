import React from "react";
import { StyleSheet, Text, View, Image, TextInput } from "react-native";
// import { Icon } from '@rneui/themed';
import Icon from '@react-native-vector-icons/ionicons';
function LoginField() {
  return (
    <View style={{ marginTop: 155 }}>
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 20,
          height: 50,
          marginHorizontal: 30,
          justifyContent: "center",
          paddingLeft: 20,
        }}
      >
        <TextInput
          placeholder="Your Email"
          placeholderTextColor={"#000"}
          style={{ fontSize: 15 }}
        />
      </View>

      <View
        style={{
          backgroundColor: "white",
          borderRadius: 20,
          height: 50,
          marginHorizontal: 30,
          justifyContent: "center",
          paddingLeft: 20,
          marginTop: 10,
        }}
      >
        <TextInput
          placeholder="Password"
          placeholderTextColor={"#000"}
          style={{ fontSize: 15 }}
        />
      </View>
    </View>
  );
}

function App() {
  return (
    <View style={styles.container}>
      <Image
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
        source={require("./assets/img/background_image_1.jpg")}
      />
      <Text
        style={{
          fontSize: 45,
          color: "white",
          fontWeight: 600,
          marginTop: 100,
          marginLeft: 20,
        }}
      >
        {"Welcome\nBack"}
      </Text>
      <Icon size={60} color={'white'} name={'arrow-forward'} type='Ionicons'/>
      <LoginField />
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
