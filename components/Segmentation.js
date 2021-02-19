import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as bodyPix from '@tensorflow-models/body-pix';
import { fetch, decodeJpeg} from '@tensorflow/tfjs-react-native';

const imageUrl = 'http://placekitten.com/222/222';
let net;

export default class Segmentation extends React.Component {

  constructor() {
    super();
    this.state = {
      segmentation: [],
      distance: 0
    }
  }

  async componentDidMount() {
    await tf.ready();
    tf.setBackend('cpu');
    net = await this.loadSegmentationModel();
    const prediction =  await this.makeSegmentation();
    this.setState({segmentation:prediction});
    console.log("prediction",this.state.segmentation.allPoses);
    console.log("width",prediction.width);
    console.log("height",prediction.height);
  }


  async loadSegmentationModel () {
    return await bodyPix.load();
  };

  async makeSegmentation() {
    const outputStride = 16;
    const segmentationThreshold = 0.5;
    const response = await fetch(imageUrl, {}, {isBinary: true});
    const rawImageData = await response.arrayBuffer();
    const raw = new Uint8Array(rawImageData);
    const imageTensor = decodeJpeg(raw);
    const segmentation =  await net.segmentPerson(imageTensor);
    alert(await segmentation.allPoses);
    const { x: xLeft, y: yLeft } = await segmentation.allPoses[0].keypoints[5].position;
    const { x: xRight, y: yRight } = await segmentation.allPoses[0].keypoints[6].position;
    const xDist = Math.pow(xLeft - xRight, 2);
    const yDist = Math.pow(yLeft - yRight, 2);
    const distance = Math.sqrt(xDist + yDist);
    console.log("distance", distance);
    alert("xRight", xRight);
    alert("yRight", yRight);
    return segmentation;
  };

  render() {
    return (
        <View style={styles.container}>
          <Text>Distance {this.state.distance}</Text>
          <Image style={styles.catImage} source={{uri: `${imageUrl}`}} id="image"/>
        </View>
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