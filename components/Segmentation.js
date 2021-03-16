import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
import {fetch} from '@tensorflow/tfjs-react-native';
import * as jpeg from 'jpeg-js'
import {BodyPix} from "@tensorflow-models/body-pix";
import {Pose} from "@tensorflow-models/body-pix/dist/types";
import {db} from '../firebase/firebase'
import firebase from "firebase";
import SyncStorage from 'sync-storage';


let segmentationModel: BodyPix;
let segmentation: Pose[];

const formatDate = () => {
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

const handleSave = () => {

    const user = SyncStorage.get('user');
    if (user)
    {
        var unix_timestamp = firebase.firestore.FieldValue.serverTimestamp();
        db.collection("users").doc(user.email).collection("mensurations").add({
                taille: "340",
                epaule: "280",
                poitrine: "100",
                tourDeTaille: "NC",
                hanche: "27",
                jambes: "10",
                timestamp: unix_timestamp,
                date: formatDate()
            }
        )
    }
};

export default class Segmentation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTfReady: true,
            measures: [],
            image: this.props.route.params.capturedImage
        };
    }

    async componentDidMount() {
        /*await tf.ready();
        segmentationModel = await this.loadSegmentationModel();
        await this.makeSegmentation();
        const dist = await this.getMeasures();
        this.setState({
            isTfReady: true,
            measures: dist
        });*/
        console.log("state", this.state.measures);
    }

    async loadSegmentationModel() {
        return await bodyPix.load({
            architecture: "MobileNetV1",
            outputStride: 16,
            multiplier: 0.75,
            quantBytes: 2,
        });
    }

    async makeSegmentation() {
        const outputStride = 16;
        const segmentationThreshold = 0.5;
        //const uri = await this.uploadImage();
        const response = await fetch("https://i.imgur.com/BwxtrEq.jpg", {}, {isBinary: true});
        const rawImageData = await response.arrayBuffer();
        const imageTensor = this.imageToTensor(rawImageData).resizeBilinear([224, 224]);
        segmentation = await segmentationModel.segmentPersonParts(imageTensor, outputStride, segmentationThreshold);
        console.log(segmentation.allPoses);
    };

    async getMeasures() {
        const measureBetweenShoulders = this.getMeasureBetween(5, 6);
        const measureBetweenHips = this.getMeasureBetween(11, 12);
        const measureBetweenHipAndAnkle = this.getMeasureBetween(11, 15);

        return [measureBetweenShoulders, measureBetweenHips, measureBetweenHipAndAnkle];
    }

    getMeasureBetween(firstPointIndex, secondPointIndex) {
        const {x: xLeftShoulder, y: yLeftShoulder} = segmentation.allPoses[0].keypoints[firstPointIndex].position;
        const {x: xRightShoulder, y: yRightShoulder} = segmentation.allPoses[0].keypoints[secondPointIndex].position;

        const xDist = Math.pow(xLeftShoulder - xRightShoulder, 2);
        const yDist = Math.pow(yLeftShoulder - yRightShoulder, 2);
        const distance = Math.sqrt(xDist + yDist).toFixed(2);
        console.log("distance between both shoulders", distance);
        return distance;
    }


    async uploadImage() {
        const imgBody = new FormData();
        imgBody.append('image', this.props.route.params.capturedImage);
        const imageLink = await fetch("https://api.imgur.com/3/image/", {
            method: "POST",
            headers: {
                Authorization: "Client-ID 8758076786d0dd1"
            },
            body: imgBody
        }).then(data => data.json()).then(res => res.data.link);
        console.log(imageLink);
        return imageLink;
    }

    imageToTensor(rawImageData) {
        //Function to convert jpeg image to tensors
        const TO_UINT8ARRAY = true;
        const {width, height, data} = jpeg.decode(rawImageData, TO_UINT8ARRAY);
        // Drop the alpha channel info for mobilenet
        const buffer = new Uint8Array(width * height * 3);
        let offset = 0; // offset into original data
        for (let i = 0; i < buffer.length; i += 3) {
            buffer[i] = data[offset];
            buffer[i + 1] = data[offset + 1];
            buffer[i + 2] = data[offset + 2];
            offset += 4;
        }
        return tf.tensor3d(buffer, [height, width, 3]);
    }


    renderInitialization() {
        return (
            <View style={styles.container}>
                {this.state.isTfReady ? (<>

                        <View style={styles.container}>
                            <Image style={{width:380, height: 460, marginLeft:17, marginTop :100}} source={require('../assets/mensuration.png')}/>
                            <Text style={styles.taille}> NC </Text>
                            <Text style={styles.epaule}> {this.state.measures[0]}</Text>
                            <Text style={styles.poitrine}> NC </Text>
                            <Text style={styles.tourDeTaille}> NC </Text>
                            <Text style={styles.hanche}> {this.state.measures[1]}</Text>
                            <Text style={styles.jambes}> {this.state.measures[2]}</Text>
                        </View>
                        <TouchableOpacity style={styles.button} onPress={handleSave}>
                            <Text style={styles.buttontext} > Sauvegarder mes mensurations </Text>
                        </TouchableOpacity>

                    </>) :

                    (
                        <View style={styles.container}>
                            <Image style={{width:380, height: 460, marginLeft:17, marginTop :100}} source={require('../assets/mensuration.png')}/>
                            <Text style={styles.title}>LOADING...</Text>
                        </View>
                    )
                }
            </View>

        );
    }

    render() {
        return (
            this.renderInitialization()
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#008080',

    },
    buttontext: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginLeft: 50
    },
    button: {
        position: 'absolute',
        alignItems: 'center',
        width: 280,
        borderRadius: 10,
        backgroundColor: '#A2D9CE',
        flexDirection: 'row',
        height: 70,
        marginLeft: 70,
        marginTop: 600
    },
    title: {
        marginTop: 30,
        marginLeft: 100,
        paddingHorizontal: 10,
        fontSize: 40,
        fontWeight: "600",
        color: 'white',
    },
    icon: {
        width: 70,
        height: 120,
        marginTop: 600,
        overflow: 'hidden',
        marginLeft: 290

    },
    soustitre: {
        marginVertical: 20,
        paddingHorizontal: 10,
        fontSize: 25,
        fontWeight: "600",
        color: '#A2D9CE',

    },
    catImage: {
        width: 100,
        height: 100,
    },
    text: {
        marginVertical: 20,
        color: 'white',
        fontSize: 15,
    },
    taille: {
        marginLeft: 335,
        marginTop: 235,
        position: 'absolute',
        color: 'black',
        fontSize: 15,
        fontWeight: "bold"
    },
    epaule: {
        marginLeft: 335,
        marginTop: 280,
        position: 'absolute',
        color: 'black',
        fontWeight: "bold",
        fontSize: 15,

    },
    poitrine: {
        marginLeft: 335,
        marginTop: 330,
        position: 'absolute',
        color: 'black',
        fontWeight: "bold",
        fontSize: 15

    },
    tourDeTaille: {
        marginLeft: 335,
        marginTop: 380,
        position: 'absolute',
        color: 'black',
        fontWeight: "bold",
        fontSize: 15
    },
    hanche: {
        marginLeft: 335,
        marginTop: 425,
        position: 'absolute',
        color: 'black',
        fontWeight: "bold",
        fontSize: 15,

    },
    jambes: {
        marginLeft: 335,
        marginTop: 470,
        position: 'absolute',
        color: 'black',
        fontWeight: "bold",
        fontSize: 15,

    },


});
