import 'react-native-gesture-handler';
import {StatusBar} from 'expo-status-bar'
import React from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Alert, ImageBackground, Image} from 'react-native'
import {Camera} from 'expo-camera'
import { Icon } from 'react-native-elements'
import { Root, Popup } from 'popup-ui'

let camera: Camera

import * as RootNavigation from './RootNavigation.js';
import Segmentation from './Segmentation.js'


export default function Picture() {

	const [startCamera, setStartCamera] = React.useState(false)
	const [previewVisible, setPreviewVisible] = React.useState(false)
	const [capturedImage, setCapturedImage] = React.useState(null)
	const [cameraType, setCameraType] = React.useState(Camera.Constants.Type.back)
	const [flashMode, setFlashMode] = React.useState('off')
	const [autoFocus, setAutoFocus] = React.useState(Camera.Constants.AutoFocus.on)
	const [nbPicture, setNbPicture] = React.useState(0)

	const __startCamera = async () => {
		console.log("Photo n. "+nbPicture)
		const {status} = await Camera.requestPermissionsAsync()
		console.log(status)
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
	}

	const __takePicture = async () => {
		const photo = await camera.takePictureAsync()
		console.log(photo)
		setPreviewVisible(true)
		//setStartCamera(false)
		setCapturedImage(photo)
	}

	const __savePhoto = (photo) => {
		const tmp = nbPicture +1
		if (nbPicture < 3) {
			setNbPicture(tmp)
			console.log("Photo + 1 = " , nbPicture)
			__retakePicture()
		}
		else if (nbPicture == 3) {
			Popup.show({
				type: 'Success',
				title: 'Informations',
				button: true,
				textBody: 'Toutes vos photos ont bien été enregistrées.',
				buttontext: 'Ok',
				callback: () => {Popup.hide(), RootNavigation.navigate('Segmentation', {capturedImage:photo})}
			})
		}
	}

	const __segmentPhoto = () => {
		console.log(capturedImage.uri)
		//return capturedImage
	}

	const __retakePicture = () => {
		setCapturedImage(null)
		setPreviewVisible(false)
		__startCamera()
	}

	const __handleFlashMode = () => {
		if (flashMode === 'on') {
			setFlashMode('off')
		} else if (flashMode === 'off') {
			setFlashMode('on')
		} else {
			setFlashMode('auto')
		}
	}

	const __handleAutoFocus = () => {
		setAutoFocus('on')
	}

	const __switchCamera = () => {
		if (cameraType === 'back') {
			setCameraType('front')
		} else {
			setCameraType('back')
		}
	}

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
						<View style={styles.container}>
							<Image style={{width:150, height: 280, marginVertical: 100}}
								   source={require('../assets/icon2.png')}/>
							<Image style={{width:250, height: 90, marginVertical: -70}}
								   source={require('../assets/logo.png')}/>

						</View>

						<TouchableOpacity

							onPress={__startCamera}

							style={{

								width: 130,

								borderRadius: 10,

								backgroundColor: '#A2D9CE',
								fontFamily:"sans-serif-light",

								flexDirection: 'row',

								justifyContent: 'center',

								alignItems: 'center',
								marginVertical: 120,
								paddingHorizontal:20,
								height: 50

							}}

						>

							<Text

								style={{

									color: 'white',

									fontSize : 20,

									fontWeight: 'bold',

									textAlign: 'center'

								}}

							>

								Take Picture

							</Text>

						</TouchableOpacity>

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

	}
})

const CameraPreview = ({photo, retakePicture, savePhoto}) => {
	console.log('sdsfds', photo)
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
							onPress={savePhoto}
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
