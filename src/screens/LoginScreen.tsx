import { StyleSheet, Text, View, Image, TextInput } from 'react-native'
import React from 'react'
import IonIcon from '@react-native-vector-icons/ionicons';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


function LoginField() {
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
          placeholder="Username"
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
  }
  return(
    <View style={{ marginTop: 15, marginBottom:70, flexDirection: 'row' }}>     
      <View style={{ paddingRight:33 }}>
      <Text style ={{ fontSize:14, color:'#fbfbfb', marginLeft:60}}>Remember me</Text>
      </View>

      <TouchableOpacity>
      <View style={{ height:70, flex:1, justifyContent:'center', paddingLeft:25 }}>
      <Text style ={{ fontSize:14, color:'#fbfbfb'}}>Forgot password?</Text>
      </View>
      </TouchableOpacity>
    </View>
  );
}

function LogInButton() {
  return(
    <TouchableOpacity>
    <View style={{ backgroundColor: '#a31edc',
          borderRadius: 15,
          height: 50,
          marginHorizontal: 100,
          justifyContent: "center",
          alignItems:'center',
          marginTop: 10}}> 

      
      <View style={{ flexDirection:'row'}}>
        <Text style={{color:'#fcfcfc', fontWeight:700, fontSize:16, paddingRight: 10 }}>Log In</Text>
        <IonIcon name="arrow-forward" size={20} color="white" />
      </View>
    </View>
    </TouchableOpacity>
  );
}

function SignupButton() {
  const navigation = useNavigation();

  const handleRegister = () => {
    navigation.navigate("SignUp");
  };
  return(

    <View style={{ marginTop: 20, flexDirection: 'row' }}>     
      <View style={{paddingRight:10}}>
      <Text style ={{ fontSize:14, color:'#fbfbfb', marginLeft:60}}>Don't have an account ?</Text>
      </View>

      <TouchableOpacity onPress={handleRegister}>
      <View>
      <Text style ={{ fontSize:14, color:'#fbfbfb'}}>Sign Up</Text>
      </View>
      </TouchableOpacity>
    </View>
  );
}


const LoginScreen = () => {
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
          <LoginField />
          <ForgotPassword/>
          <LogInButton/>
          <SignupButton/>

        </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});