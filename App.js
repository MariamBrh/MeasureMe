import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Picture from './components/Picture.js'
import Segmentation from './components/Segmentation.js'
import Login from './components/Login.js';
import Historique from './components/Historique.js';

import { navigationRef } from './components/RootNavigation';

const Stack = createStackNavigator();


export default class App extends React.Component {


  renderInitialization() {
  	return (
  		<NavigationContainer ref={navigationRef}>
      		<Stack.Navigator>
                <Stack.Screen name="Login" component={Login}/>
                <Stack.Screen name="Picture" component={Picture} />
                <Stack.Screen name="Segmentation" component={Segmentation} />
                <Stack.Screen name="Historique" component={Historique}/>
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
