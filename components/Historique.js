import React, {useState, useEffect} from 'react'
import {db} from '../firebase/firebase'
import {View, Text, Alert, StyleSheet} from 'react-native'
import {MaterialIcons} from '@expo/vector-icons';
import SyncStorage from 'sync-storage';

const Historique = () => {

    const [historique, sethistorique] = useState([])
    const [click, setclick] = useState(false)
    const user = SyncStorage.get('user');

    useEffect(() => {
        db.collection("users").doc(user.email).collection("mensurations").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
            sethistorique(snapshot.docs.map((doc) => ({
                id: doc.id,
                taille: doc.data().taille,
                epaule: doc.data().epaule,
                poitrine: doc.data().poitrine,
                tourDeTaille: doc.data().tourDeTaille,
                hanche: doc.data().hanche,
                jambes: doc.data().jambes,
                date: doc.data().date
            })))
        })
    }, []);

    const onPress = (index) => {
        if (click == index) {
            setclick(null)
        } else {
            setclick(index)
        }
    };


    return (
        <View style={{backgroundColor: '#008080', height: "100%"}}>
            {
                historique.map((doc, index) => {
                    return (
                        <View style={{display: 'flex', flexDirection: 'column'}} key={doc.id}>
                            <View style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderBottomColor: "white",
                                borderBottomWidth: 1
                            }} key={index}>
                                <View style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: "70%"
                                }}>
                                    <Text style={styles.date}>{doc.date.toString()}</Text>
                                </View>
                                <View>
                                    <MaterialIcons.Button
                                        name={click == index ? "keyboard-arrow-down" : "keyboard-arrow-right"} size={25}
                                        color="white" style={{backgroundColor: '#008080'}}
                                        onPress={() => onPress(index)}/>

                                </View>


                            </View>
                            {

                                click == index ? (
                                    <View>
                                        <View style={{
                                            backgroundColor: "white",
                                            padding: 10,
                                            display: 'flex',
                                            flexDirection: "row"
                                        }}><Text>Taille : {doc.taille}</Text>
                                        </View>
                                        <View style={{
                                            backgroundColor: "white",
                                            padding: 10,
                                            display: 'flex',
                                            flexDirection: "row"
                                        }}><Text>Épaule : {doc.epaule}</Text>
                                        </View>
                                        <View style={{
                                            backgroundColor: "white",
                                            padding: 10,
                                            display: 'flex',
                                            flexDirection: "row"
                                        }}><Text>Poitrine : {doc.poitrine}</Text>
                                        </View>
                                        <View style={{
                                            backgroundColor: "white",
                                            padding: 10,
                                            display: 'flex',
                                            flexDirection: "row"
                                        }}>
                                            <Text>Tour de taille : {doc.tourDeTaille}</Text>
                                        </View>
                                        <View style={{
                                            backgroundColor: "white",
                                            padding: 10,
                                            display: 'flex',
                                            flexDirection: "row"
                                        }}><Text>Hanche : {doc.hanche}</Text>
                                        </View>
                                        <View style={{
                                            backgroundColor: "white",
                                            padding: 10,
                                            display: 'flex',
                                            flexDirection: "row"
                                        }}><Text>Jambes : {doc.jambes}</Text>
                                        </View>
                                    </View>
                                ) : null
                            }

                        </View>
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#008080',
        alignItems: 'center',
        justifyContent: 'center'
    },
    date: {
        flex: 1,
        color: "white"
    }

})
export default Historique
