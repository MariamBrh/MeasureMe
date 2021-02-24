import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
import {fetch} from '@tensorflow/tfjs-react-native';
import * as jpeg from 'jpeg-js'
import {BodyPix} from "@tensorflow-models/body-pix";
import {Pose} from "@tensorflow-models/body-pix/dist/types";


let segmentationModel: BodyPix;
let segmentation: Pose[];

export default class Segmentation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTfReady: false,
            measures: [],
            image: this.props.route.params.capturedImage
        };
    }

    async componentDidMount() {
        await tf.ready();
        segmentationModel = await this.loadSegmentationModel();
        await this.makeSegmentation();
        const dist = await this.getMeasures();
        this.setState({
            isTfReady: true,
            measures: dist
        });
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
                        <Text>Distance entre les deux épaules : {this.state.measures[0]}</Text>
                        <Text>Distance entre les deux hanches : {this.state.measures[1]}</Text>
                        <Text>Longueur de la jambe gauche : {this.state.measures[2]}</Text>
                    </>) :
                    (
                        <Text>LOADING ...</Text>
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
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    catImage: {
        width: 100,
        height: 100,
    }
});