
import React, {useState} from 'react'
// import PasswordInputText from 'react-native-hide-show-password-input';
import { View, Form, StyleSheet, Text, Button, Alert, TextInput, Image, TouchableOpacity} from 'react-native'
import { auth, db } from '../firebase/firebase'
import firebase from "firebase";

const Login = ({navigation}) => {

    const [password, setpassword] = useState("")
    const [email, setemail] = useState("")

    const onSignIn = () => {

        auth.signInWithEmailAndPassword(email,password).then(auth=>{navigation.navigate('Picture')}).catch(error=>Alert.alert(error.message))

    }

    const onRegister = () => {
        auth.createUserWithEmailAndPassword(email,password).then(auth=>{Alert.alert("account created")}).catch(error=>Alert.alert(error.message))

    }



    return (
        <View style={styles.container}>
            <View style={styles.img_container}>
              <Image style={{width:150, height: 280, marginTop :30}} source={require('../assets/icon2.png')}/>
              <Image style={{width:250, height: 90,marginTop :20}} source={require('../assets/logo.png')}/>
              <Text style={styles.text1}>Email</Text>
              <TextInput defaultValue={email} onChangeText={(e)=>setemail(e)} style={styles.email}/>
              <Text style={styles.text2}>Password</Text>
              <TextInput defaultValue={password} onChangeText={(e)=>setpassword(e)} style={styles.password} secureTextEntry={true}/>
              {/* <PasswordInputText Value={password} onChangeText={(e)=>setpassword(e)} style={{backgroundColor:'#A2D9CE'}}/> */}
              <TouchableOpacity onPress={onSignIn}><Text style={styles.signupButton2}> SignIn</Text></TouchableOpacity>
              <View style={styles.signupTextCont}>
              <Text style={styles.signupText}>Don't have an account yet?</Text>
              <TouchableOpacity onPress={onRegister}><Text style={styles.signupButton}> SignUp</Text></TouchableOpacity>
              </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
	container: {
    flex :1,
    backgroundColor: '#008080'
	},
	img_container:{
		flex:1,
		alignItems:'center',
		justifyContent:'center',
		marginBottom:40
	},
	email: {
    color:"#008080",
    backgroundColor:'#BFD8D3',
    height :30,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal:140,
    borderRadius:10
	},
  password: {
    color:"#008080",
    backgroundColor:'#BFD8D3',
    height :30,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal:140,
    borderRadius:10
	},
	text1: {
    marginTop: 50,
    marginRight: 230,
    paddingHorizontal:20,
    fontSize:20,
    fontWeight: "600",
    color:'white',
	},
  text2: {
    marginTop: 20,
    marginRight: 190,
    paddingHorizontal:20,
    fontSize:20,
    fontWeight: "600",
    color:'white',
	},
  signupTextCont : {
   flexGrow: 1,
   alignItems:'flex-end',
   justifyContent :'center',
   paddingVertical:16,
   flexDirection:'row'
 },
 signupText: {
   color:'rgba(255,255,255,0.6)',
   fontSize:20,
   marginTop:20
 },
 signupButton: {
  	color:'white',
  	fontSize:20,
  	fontWeight:'500'
  },
  signupButton2: {
    marginTop:30,
   	color:'white',
   	fontSize:20,
   	fontWeight:'500'
   }
})
export default Login
