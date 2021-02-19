import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Picture from './components/Picture.js'
import Segmentation from './components/Segmentation.js'

import { navigationRef } from './components/RootNavigation';

const Stack = createStackNavigator();


export default class App extends React.Component {


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
