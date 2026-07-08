import { StyleSheet, Text, View, Image, TextInput } from 'react-native'
import React from 'react'
import IonIcon from '@react-native-vector-icons/ionicons';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';



function SignUpField() {
  return (
    <View style={{ marginTop: 155 }}>
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 15,
          height: 50,
          marginHorizontal: 30,
          justifyContent: "center",
          paddingLeft: 20
        }}
      >
        <TextInput
          placeholder="Name"
          placeholderTextColor={"#000"}
          style={{ fontSize: 15 }}
        />
      </View>

      <View
        style={{
          backgroundColor: "white",
          borderRadius: 15,
          height: 50,
          marginHorizontal: 30,
          justifyContent: "center",
          paddingLeft: 20,
          marginTop: 10
        }}
      >
        <TextInput
          placeholder="User name"
          placeholderTextColor={"#000"}
          style={{ fontSize: 15 }}
        />
      </View>
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 15,
          height: 50,
          marginHorizontal: 30,
          justifyContent: "center",
          paddingLeft: 20,
          marginTop: 10
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

function ForgotPassword() {
  return(
    <View style={{ flexDirection: 'row' }}>     
      <View style={{ height:70, flex:1, justifyContent:'center' }}>
      <Text style ={{ fontSize:14, color:'#fbfbfb', marginLeft:60}}>Remember me</Text>
      </View>

      <View style={{ height:70, flex:1, justifyContent:'center', paddingLeft:25 }}>
      <Text style ={{ fontSize:14, color:'#fbfbfb'}}>Forgot password?</Text>
      </View>
    </View>
  );
}

function SignUpButton() {
  return(

    <View style={{ backgroundColor: '#a31edc',
          borderRadius: 15,
          height: 50,
          marginHorizontal: 100,
          justifyContent: "center",
          alignItems:'center',
          marginTop: 10}}> 

      <View style={{ flexDirection:'row'}}>
        <Text style={{color:'#fcfcfc', fontWeight:700, fontSize:16, paddingRight: 10 }}>Sign Up</Text>
        <IonIcon name="arrow-forward" size={20} color="white" />
      </View>    
    </View>
  );
}

function LoginButton() {
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate("Login");
  };
  return(

    <View style={{ marginTop: 20, flexDirection: 'row' }}>     
      <View style={{paddingRight:10}}>
      <Text style ={{ fontSize:14, color:'#fbfbfb', marginLeft:60}}>Already have an account ?</Text>
      </View>

      <TouchableOpacity onPress={handleLogin}>
      <View>
      <Text style ={{ fontSize:14, fontWeight:800, color:'#529df3'}}>Login</Text>
      </View>
      </TouchableOpacity>
    </View>
  );
}

const SignUpScreen = () => {
  return (
    <View style={styles.container}>
          <Image
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
            }}
            source={require('../../assets/img/background_image_1.jpg')}
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
          <SignUpField />
          <ForgotPassword/>
          <SignUpButton/>
          <LoginButton/>
        </View>
  )
}

export default SignUpScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});