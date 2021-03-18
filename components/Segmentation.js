import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
import { fetch, decodeJpeg} from '@tensorflow/tfjs-react-native';
import * as jpeg from 'jpeg-js'
import {BodyPix} from "@tensorflow-models/body-pix";
import {Pose} from "@tensorflow-models/body-pix/dist/types";
import {handleSave, loadSegmentationModel} from "../utils/utils";


let segmentationModel: BodyPix;
let segmentationFace: Pose[];
let segmentationProfil: Pose[];


export default class Segmentation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTfReady: false,
            measures: [],
            images: this.props.route.params.images,
            scale: this.props.route.params.scale
        };
    }

    async componentDidMount() {
        await tf.ready();
        segmentationModel = await loadSegmentationModel();
        segmentationFace = await this.makeSegmentation(this.state.images[0]);
        segmentationProfil = await this.makeSegmentation(this.state.images[1]);
        const dist = await this.getMeasures();
        this.setState({
            isTfReady: true,
            measures: dist
        });
    }

    async makeSegmentation(url){
        const outputStride = 16;
        const segmentationThreshold = 0.5;
        const response = await fetch(`${url.slice(27)}.jpeg`, {}, {isBinary: true});
        const rawImageData = await response.arrayBuffer();
        const raw = new Uint8Array(rawImageData);
        const imageTensor = decodeJpeg(raw);
        return await segmentationModel.segmentPersonParts(imageTensor, outputStride, segmentationThreshold);
    };

    async getMeasures() {
        const measureBetweenShoulders = this.getMeasureBetween(5, 6,segmentationFace);
        const measureBetweenHips = this.getMeasureBetween(11, 12,segmentationFace);
        const measureBetweenHipAndAnkle = this.getMeasureBetween(11, 15,segmentationProfil);
        return [measureBetweenShoulders, measureBetweenHips, measureBetweenHipAndAnkle];
    }

    getMeasureBetween(firstPointIndex, secondPointIndex,segmentation) {
        const {x: xLeftShoulder, y: yLeftShoulder} = segmentation.allPoses[0].keypoints[firstPointIndex].position;
        const {x: xRightShoulder, y: yRightShoulder} = segmentation.allPoses[0].keypoints[secondPointIndex].position;
        const xDist = Math.pow(xLeftShoulder - xRightShoulder, 2);
        const yDist = Math.pow(yLeftShoulder - yRightShoulder, 2);
        const distance = Math.sqrt(xDist + yDist);
        const distanceToScale = (distance * 24)/ this.state.scale;
        return distanceToScale.toFixed(2);
    }


    renderInitialization() {
        return (
            <View style={styles.container}>
                {this.state.isTfReady ? (<>
                        <View style={styles.container}>
                            <Image style={{width:380, height: 460, marginLeft:17, marginTop :100}} source={require('../assets/mensuration.png')}/>
                            <Text style={styles.taille}> {this.state.measures[0]} </Text>
                            <Text style={styles.epaule}> {this.state.measures[1]} </Text>
                            <Text style={styles.poitrine}> NC </Text>
                            <Text style={styles.tourDeTaille}> NC </Text>
                            <Text style={styles.hanche}> {this.state.measures[2]} </Text>
                            <Text style={styles.jambes}> {this.state.measures[3]} </Text>
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

    }
});
