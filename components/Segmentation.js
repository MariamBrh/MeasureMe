import React from 'react';
import {StyleSheet, View, Image} from 'react-native';
import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
import {fetch} from '@tensorflow/tfjs-react-native';
import * as jpeg from 'jpeg-js'


let segmentationModel;
let segmentation;

export default class Segmentation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTfReady: false,
            mobilenetClasses: [],
            image: this.props.route.params.capturedImage,
        };
    }

    async componentDidMount() {
        await tf.ready();
        segmentationModel = await this.loadSegmentationModel();
        const mobileNetPrediction = await this.makeSegmentation();
        this.setState({
            isTfReady: true,
            mobilenetClasses: mobileNetPrediction,
        });
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
        segmentation = await this.makeMSegmentationImageLOCALE();
        return 0;
    }

    async makeMSegmentationImageLOCALE() {
        const outputStride = 16;
        const segmentationThreshold = 0.5;
        const image = require('../assets/images/face.jpeg');
        const imageAssetPath = Image.resolveAssetSource(image);
        const response = await fetch(imageAssetPath.uri, {}, {isBinary: true});
        const rawImageData = await response.arrayBuffer();
        const imageTensor = this.imageToTensor(rawImageData).resizeBilinear([224, 224]);
        const res = await segmentationModel.segmentPersonParts(imageTensor, outputStride, segmentationThreshold);
        console.log("res", res);
        return res;
    };

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
                <Image source={require('../assets/images/face.jpeg')} ref={this.imageRef}/>
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