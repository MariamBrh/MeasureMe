import React, {useState} from 'react'
import {View, StyleSheet, Text, Alert, TextInput, Image, TouchableOpacity} from 'react-native'
import {auth, db} from '../firebase/firebase'
import SyncStorage from 'sync-storage';

const Login = ({navigation}) => {

    const [password, setpassword] = useState("");
    const [email, setemail] = useState("");

    const onSignIn = () => {
        auth.signInWithEmailAndPassword(email, password).then(auth => {
            SyncStorage.set('user', {email: email});
            navigation.navigate('Picture')
        }).catch(error => Alert.alert(error.message))
    };

    const onRegister = () => {
        auth.createUserWithEmailAndPassword(email, password).then(auth => {
            Alert.alert("account created")
        }).catch(error => Alert.alert(error.message))

    };


    return (
        <View style={styles.container}>
            <View style={styles.img_container}>
                <Image style={{width: 150, height: 280, marginTop: 30}} source={require('../assets/icon2.png')}/>
                <Image style={{width: 250, height: 90, marginTop: 20}} source={require('../assets/logo.png')}/>
                <Text style={styles.text1}>E-mail</Text>
                <TextInput defaultValue={email} onChangeText={(e) => setemail(e)} style={styles.inputBox}/>
                <Text style={styles.text2}>Mot de passe</Text>
                <TextInput defaultValue={password} onChangeText={(e) => setpassword(e)} style={styles.inputBox}
                           secureTextEntry={true}/>

                <TouchableOpacity onPress={onSignIn}><Text
                    style={styles.signInButton2}> Connexion</Text></TouchableOpacity>
                <View style={styles.signupTextCont}>
                    <Text style={styles.signupText}>Pas encore de compte ?</Text>
                    <TouchableOpacity onPress={onRegister}><Text
                        style={styles.signupButton}> S'inscrire</Text></TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#008080'
    },
    img_container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40
    },

    inputBox: {
        height: 40,
        width: 300,
        backgroundColor: 'rgba(255, 255,255,0.2)',
        borderRadius: 4,
        paddingHorizontal: 16,
        fontSize: 20,
        color: '#ffffff',
        marginVertical: 10
    },
    text1: {
        marginTop: 50,
        marginRight: 240,
        paddingHorizontal: 20,
        fontSize: 20,
        fontWeight: "600",
        color: 'white',
    },
    text2: {
        marginTop: 20,
        marginRight: 180,
        paddingHorizontal: 20,
        fontSize: 20,
        fontWeight: "600",
        color: 'white',
    },
    signupTextCont: {
        flexGrow: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingVertical: 16,
        flexDirection: 'row'
    },
    signupText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 20,
        marginTop: 20
    },
    signupButton: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500'
    },
    signInButton2: {

        padding: 10,
        backgroundColor: '#BFD8D3',
        marginTop: 20,
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
        borderRadius: 20,

    }
});
export default Login
