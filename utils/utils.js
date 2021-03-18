import SyncStorage from "sync-storage";
import firebase from "firebase";
import {db} from "../firebase/firebase";
import * as bodyPix from "@tensorflow-models/body-pix";
import {fetch} from "@tensorflow/tfjs-react-native";


export const formatDate = () => {
    var d = new Date();
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();
    var hours = d.getHours();
    var min = d.getMinutes();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    if (hours < 10)
        hours = '0' + hours;
    if (min < 10)
        min = '0' + min;
    return [day, month, year].join('-')+" "+hours+":"+min;
};

export const handleSave = () => {

    const user = SyncStorage.get('user');
    if (user)
    {
        var unix_timestamp = firebase.firestore.FieldValue.serverTimestamp();
        db.collection("users").doc(user.email).collection("mensurations").add({
                taille: "171",
                epaule: "39",
                poitrine: "NC",
                tourDeTaille: "NC",
                hanche: "29",
                jambes: "80",
                timestamp: unix_timestamp,
                date: formatDate()
            }
        )
    }
};


export const loadSegmentationModel= async ()=>  {
    return await bodyPix.load({
        architecture: "MobileNetV1",
        outputStride: 16,
        multiplier: 0.75,
        quantBytes: 2,
    });
};


export const uploadImage = async (image)=> {
    const imgBody = new FormData();
    imgBody.append('image', image);
    const imageLink = await fetch("https://api.imgur.com/3/image/", {
        method: "POST",
        headers: {
            Authorization: "Client-ID 8758076786d0dd1"
        },
        body: imgBody
    }).then(data => data.json()).then(res => res.data.link);
    console.log("imageLink",imageLink);
    return imageLink;
};


export const getScale = async (uri)=> {
    const id = uri.slice(20,27);
    const scale = await fetch(`http://3.18.220.26/predict/${id}.jpg`, {
        method: "POST"
    }).then(data => data._bodyText);
    console.log("scale",scale);
    return scale;
};

