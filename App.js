import React, { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Picture from './components/Picture.js'
import Segmentation from './components/Segmentation.js'

import { navigationRef } from './components/RootNavigation';

const Stack = createStackNavigator();


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTfReady: false,
      mobilenetClasses: [],
    };
  }


  async componentDidMount() {
    await tf.ready();
    this.setState({
      isTfReady: true
    });
  }


  renderInitialization() {
  	return (
  		<NavigationContainer ref={navigationRef}>
      		<Stack.Navigator>
        		<Stack.Screen name="Home" component={Picture} />
                <Stack.Screen name="Segmentation" component={Segmentation} />
      		</Stack.Navigator>
    	</NavigationContainer>
  	)
  }


  render() {
    return (
       this.renderInitialization()
    );
  }
}
