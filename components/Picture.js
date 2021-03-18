import 'react-native-gesture-handler';
import {StatusBar} from 'expo-status-bar'
import React from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Alert, ImageBackground, Image} from 'react-native'
import {Camera} from 'expo-camera'
import { Icon } from 'react-native-elements'
import { Root, Popup } from 'popup-ui'

let camera: Camera;
let nbPicture = 0;

import * as RootNavigation from './RootNavigation.js';
import Segmentation from './Segmentation.js'
import {getScale, uploadImage} from "../utils/utils";


export default function Picture({navigation}) {

	const [startCamera, setStartCamera] = React.useState(false);
	const [previewVisible, setPreviewVisible] = React.useState(false);
	const [capturedImage, setCapturedImage] = React.useState(null);
	const [cameraType, setCameraType] = React.useState(Camera.Constants.Type.back);
	const [flashMode, setFlashMode] = React.useState('off');
	const [autoFocus, setAutoFocus] = React.useState(Camera.Constants.AutoFocus.on);
	const [tabPictures, setTabPictures] = React.useState([]);

	const __startCamera = async () => {
		console.log("Photo n. "+nbPicture);
		const {status} = await Camera.requestPermissionsAsync();
		if (status === 'granted') {
			setStartCamera(true)
		} else {
			Alert.alert('Access denied')
		}

		if (nbPicture == 0) {
			Popup.show({
				type: 'Warning',
				title: 'Informations',
				button: true,
				textBody: 'Prenez une photo de face en tenant une feuille blanche de format A4 devant vous.',
				buttontext: 'Ok',
				callback: () => Popup.hide()
			})
		}
		else if (nbPicture == 1) {
			Popup.show({
				type: 'Warning',
				title: 'Informations',
				button: true,
				textBody: 'Prenez une photo de face, les bras le long du corps.',
				buttontext: 'Ok',
				callback: () => Popup.hide()
			})
		}
		else if (nbPicture == 2) {
			Popup.show({
				type: 'Warning',
				title: 'Informations',
				button: true,
				textBody: 'Prenez une photo de profil, les bras le long du corps.',
				buttontext: 'Ok',
				callback: () => Popup.hide()
			})
		}
	};

	const __takePicture = async () => {
		const photo = await camera.takePictureAsync();
		setPreviewVisible(true);
		setCapturedImage(photo)
	};

	const __savePhoto = async (photo) => {
		const imgurUri = await uploadImage(photo);
		setTabPictures([...tabPictures,imgurUri]);
		if (nbPicture == 2) {
			Popup.show({
				type: 'Success',
				title: 'Informations',
				button: true,
				textBody: 'Toutes vos photos ont bien été enregistrées.',
				buttontext: 'Ok',
				callback: async () => {Popup.hide(), RootNavigation.navigate('Segmentation', {images: [tabPictures[1],tabPictures[2]],scale: await getScale(tabPictures[0])})}
			})
		}
		else {
			nbPicture = nbPicture + 1;
			setTabPictures([...tabPictures,imgurUri]);
			__retakePicture()
		}
	};





	const __retakePicture = () => {
		setCapturedImage(null);
		setPreviewVisible(false);
		__startCamera()
	};

	const __handleFlashMode = () => {
		if (flashMode === 'on') {
			setFlashMode('off')
		} else if (flashMode === 'off') {
			setFlashMode('on')
		} else {
			setFlashMode('auto')
		}
	};

	const __handleAutoFocus = () => {
		setAutoFocus('on')
	};

	const __switchCamera = () => {
		if (cameraType === 'back') {
			setCameraType('front')
		} else {
			setCameraType('back')
		}
	};

	const goToHistorical = () => {
		navigation.navigate("Historique")
	};

	return (
		<Root>
			<View style={styles.container}>
				{startCamera ? (
					<View
						style={{
							flex: 1,
							width: '100%'
						}}
					>
						{previewVisible && capturedImage ? (
							<CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />
						) : (
							<Camera
								type={cameraType}
								flashMode={flashMode}
								autoFocus={autoFocus}
								style={{flex: 1}}
								ref={(r) => {
									camera = r
								}}
							>
								<View
									style={{
										flex: 1,
										width: '100%',
										backgroundColor: 'transparent',
										flexDirection: 'row'
									}}
								>
									<View
										style={{
											position: 'absolute',
											left: '5%',
											top: '10%',
											flexDirection: 'column',
											justifyContent: 'space-between'
										}}
									>
										<TouchableOpacity
											onPress={__handleFlashMode}
											style={{
												backgroundColor: flashMode === 'off' ? '#626567' : 'white',
												borderRadius: '50%',
												height: 35,
												width: 30
											}}
										>
											<Text
												style={{
													fontSize: 30
												}}
											>
												⚡️
											</Text>
										</TouchableOpacity>
										<TouchableOpacity
											onPress={__switchCamera}
											style={{
												marginTop: 20,
												borderRadius: '50%',
												height: 25,
												width: 25
											}}
										>
											<Text
												style={{
													fontSize: 20
												}}
											>
												{cameraType === 'front' ? '🤳' : '📷'}
											</Text>
										</TouchableOpacity>
										<TouchableOpacity
											onPress={__handleAutoFocus}
											style={{
												marginTop: 20,
												borderRadius: '50%',
												height: 25,
												width: 25
											}}
										>
											<Icon
												name='center-focus-weak' />
										</TouchableOpacity>
									</View>
									<View
										style={{
											position: 'absolute',
											bottom: 0,
											flexDirection: 'row',
											flex: 1,
											width: '100%',
											padding: 30,
											justifyContent: 'space-between'
										}}
									>
										<View
											style={{
												alignSelf: 'center',
												flex: 1,
												alignItems: 'center'
											}}
										>
											<TouchableOpacity
												onPress={__takePicture}
												style={{
													width: 70,
													height: 70,
													bottom: 0,
													borderRadius: 50,
													backgroundColor: 'white'
												}}
											/>
										</View>
									</View>
								</View>
							</Camera>
						)}
					</View>
				) : (
					<View

						style={{

							flex: 1,

							backgroundColor: '#008080',

							justifyContent: 'center',

							alignItems: 'center'

						}}

					>
						<View style={styles.img_container}>
							<Image style={{width:150, height: 280, marginVertical: 100}}
								   source={require('../assets/icon2.png')}/>
							<Image style={{width:250, height: 90, marginVertical: -70}}
								   source={require('../assets/logo.png')}/>

						</View>
						<View style={{padding:20,marginBottom:20}}>
							<TouchableOpacity

								onPress={__startCamera}

								style={styles.button}>

								<Text style={styles.takepicture}>Prendre une photo</Text>

							</TouchableOpacity>
							<TouchableOpacity
								onPress={goToHistorical}
								style={styles.button}
							>
								<Text
									style={styles.takepicture}
								>

								Historique

								</Text>
							</TouchableOpacity>
						</View>
					</View>

				)}

				<StatusBar style="auto" />
			</View>
		</Root>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#008080',
		alignItems: 'center',
		justifyContent: 'center'
	},
	img_container:{
		flex:1,
		alignItems:'center',
		justifyContent:'center',
		marginBottom:150
	},
	logoText : {
		marginVertical: 10,
		paddingHorizontal:10,
		fontSize:60,
		fontWeight: "700",
		color:'white',
		textShadowOffset:{width: 5, height: 3},
		textShadowRadius:5,
	},
	PictureText: {
		color:'white',
		fontSize:10,
		alignItems:'center',
		justifyContent :'center',
		paddingVertical:12,
		marginVertical: 120
		//flexDirection:'row',

	},
	styleEc: {
		color: "white",
		fontWeight: "bold",
		fontSize:16,
		paddingLeft:30,
		paddingRight:30,
		textShadowColor:"#585858",

	},
	takepicture: {
		color:'white',
		fontSize:25,
		fontWeight: "700",
	},
	button: {
		width: 260,
		borderRadius: 10,
		backgroundColor: '#A2D9CE',
		fontFamily:"sans-serif-light",
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom:10,
		height: 50
	}


})

const CameraPreview = ({photo, retakePicture, savePhoto}) => {

	return (
		<View
			style={{
				backgroundColor: 'transparent',
				flex: 1,
				width: '100%',
				height: '100%'
			}}
		>
			<ImageBackground
				source={{uri: photo && photo.uri}}
				style={{
					flex: 1
				}}
			>
				<View
					style={{
						flex: 1,
						flexDirection: 'column',
						padding: 15,
						justifyContent: 'flex-end'
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between'
						}}
					>
						<TouchableOpacity
							onPress={retakePicture}
							style={{
								width: 130,
								height: 40,
								alignItems: 'center',
								borderRadius: 4
							}}
						>
							<Text style={styles.styleEc}>Re-Take</Text>

						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => savePhoto(photo)}
							style={{
								width: 130,
								height: 50,

								alignItems: 'center',
								borderRadius: 4
							}}
						>
							<Text style={styles.styleEc}>Save</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ImageBackground>
		</View>
	)
}
