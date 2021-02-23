import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
import { fetch, decodeJpeg} from '@tensorflow/tfjs-react-native';



// Position of camera preview.
const previewLeft = 40;
const previewTop = 20;
const previewWidth = 200;
const previewHeight = 300;

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
    segmentation = await this.makeModelSegmentationImage();
    console.log(segmentation.allPoses[0].keypoints[5]
        .position);
    const { x: xLeft, y: yLeft } = await segmentation.allPoses[0].keypoints[5].position;
    const { x: xRight, y: yRight } = await segmentation.allPoses[0].keypoints[6].position;
    const xDist = Math.pow(xLeft - xRight, 2);
    const yDist = Math.pow(yLeft - yRight, 2);
    const distance = Math.sqrt(xDist + yDist);
    console.log("distance", distance);
    return segmentation.allPoses[0].keypoints[5]
        .position.x;
  }

  async makeModelSegmentationImage() {
    console.log("entered")
    const outputStride = 16;
    const segmentationThreshold = 0.5;
    const image = require('../assets/images/inconu.jpg');
    const imageAssetPath = Image.resolveAssetSource(image);
    const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
    console.log("fetch done !")
    const rawImageData = await response.arrayBuffer();
    const raw = new Uint8Array(rawImageData);
    const imageTensor = decodeJpeg(raw);
    return await segmentationModel.segmentPersonParts(imageTensor, outputStride, segmentationThreshold);
  }

  renderInitialization() {
    return (
        <View style={styles.container}>
          <Text>Distance {this.state.mobilenetClasses}</Text>
          <Image style={styles.catImage} source={{uri: `${this.state.image.uri}`}} id="image"/>
        </View>
    );
  }


  render() {
    const {isTfReady} = this.state;
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
  cameraContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '60%',
    backgroundColor: '#fff',
  },
  camera : {
    position:'absolute',
    left: previewLeft,
    top: previewTop,
    width: previewWidth,
    height: previewHeight,
    zIndex: 1,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 0,
  },
  bbox: {
    position:'absolute',
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 0,
  },
  catImage: {
    width: 100,
    height: 100,
  }
});