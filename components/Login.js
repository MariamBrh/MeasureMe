
import React, {useState} from 'react'
// import PasswordInputText from 'react-native-hide-show-password-input';
import { View, Text, Button, Alert, TextInput } from 'react-native'
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
        <View style={{display:'flex',
            alignItems:'center',
            justifyContent:'center',
            height:"100%",
            backgroundColor: '#008080'
            }}>
            <Text
                style={{
                    fontSize:30,
                    padding:25
                }} 
            >
            Bienvenue sur MeasureMe</Text>
            <View style={{
                backgroundColor: '#008080',
                height:"70%",
                width:"60%",
                padding:"5%",
                display:'flex',
                flexDirection:'column',
                justifyContent:'space-around',
                borderColor:"white",
                borderWidth:1,
                borderRadius:40
                }}>
                <View>
                    <Text style={{margin:10}}>Email</Text>
                    <TextInput defaultValue={email} onChangeText={(e)=>setemail(e)} style={{backgroundColor:'#A2D9CE'}}/>
                </View>
                <View>
                    <Text style={{margin:10}}>Password</Text>
                    <TextInput defaultValue={password} onChangeText={(e)=>setpassword(e)} style={{backgroundColor:'#A2D9CE'}} secureTextEntry={true}/>
                    {/* <PasswordInputText Value={password} onChangeText={(e)=>setpassword(e)} style={{backgroundColor:'#A2D9CE'}}/> */}
                </View>
                <Button
                    color='#A2D9CE'
                    title="Connexion"
                    onPress={onSignIn}
                />
                <Button
                    
                    color='#A2D9CE'
                    title="Inscription"
                    onPress={onRegister}
                />
            </View>
        </View>
    )
}

export default Login
