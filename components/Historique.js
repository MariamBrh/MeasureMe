import React,{useState,useEffect} from 'react'
import {db} from '../firebase/firebase'
import { View, Text, Alert} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
// import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

const Historique = () => {

    const [historique, sethistorique] = useState([])
    const [click,setclick] = useState(false)

    useEffect(() => {
        db.collection("infostest").orderBy("date","desc").onSnapshot((snapshot)=>{
            sethistorique(snapshot.docs.map((doc)=>({
                id:doc.id,
                taille:doc.data().taille,
                timestamp:doc.data().timestamp
            })))
        })
    }, [])

    const onPress = (index) => {
        if(click==index){
            setclick(null)
        }
        else
        {
            setclick(index)
        }
    }


    return (
        <View style={{backgroundColor:'#008080',height:"100%"}}>
            {
                historique.map((doc,index)=>{
                    return(
                        /* <View key={doc.id}>
                            <li>{doc.timestamp}</li>
                            <li>{doc.taille}</li>
                        </View> */
                        <View style={{display:'flex' ,flexDirection:'column'}}>
                            <View style={{display:'flex',flexDirection:'row',alignItems:'center',borderBottomColor:"white",borderBottomWidth:1}} key={index}>
                                <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',width:"70%"}}>
                                    <Text>{doc.timestamp.toString()}</Text>
                                </View>
                                <View>
                                    <MaterialIcons.Button name={click==index ? "keyboard-arrow-down":"keyboard-arrow-right"} size={24} color="black" style={{backgroundColor:'#008080'}} onPress={()=>onPress(index)}/>
                                </View>
                                
                                
                            </View>
                            {
                                    click==index? (
                                        <View style={{backgroundColor:"white",padding:10, display:'flex', flexDirection:"row"}}><Text>Taille : </Text><Text>{doc.taille}</Text></View>
                                    ):null
                                }
                        </View>
                    )})
            }
        </View>
    )
}

export default Historique
