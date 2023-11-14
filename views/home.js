import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Button, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';



export default function WelcomeScreen({ navigation }) {

    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [cameraRef, setCameraRef] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [showCamera, setShowCamera] = useState(true);
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [confirmar, setConfirmar] = useState('ok')

    useEffect(() => {
        requestPermission()
    }, [])

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    useEffect(() => {

        if (location) {

            const { latitude, longitude } = location.coords;
            setUserLocation({ latitude, longitude });

        }

    }, [location]);


    if (!permission?.granted) {
        return
    }

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    const takePicture = async () => {
        if (cameraRef) {
            const photo = await cameraRef.takePictureAsync();
            setCapturedImage(photo);
            setShowCamera(false);
        }
    };

    const retakePicture = () => {
        setCapturedImage(null);
        setShowCamera(true);
    };

    const aceitar = () => {
        setConfirmar(null);
    }

    const sendPictureToAPI = async () => {
        if (capturedImage) {
            const data = new FormData();
            data.append('image', {
                uri: capturedImage.uri,
                name: 'image.jpg',
                type: 'image/jpg',
            });

            data.append('drive', '18AWmmAgDZ0MkKOaP9MBu7PiT8bKfKDya');
            data.append('db', '1WHwXzD89nfAb6eU8Ds2O8c76RpJmJTCqEa6Aht1m484');
            data.append('latitude', userLocation.latitude);
            data.append('longitude', userLocation.longitude);

            try {
                const response = await axios.post('http://backend:3000/upload', data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Lógica de manipulação de resposta da API
                navigation.navigate('Login')


                // Após o envio bem-sucedido, você pode redirecionar o usuário para outra tela ou fazer qualquer ação necessária.
                // navigation.navigate('OutraTela');
            } catch (error) {
                // Lógica de tratamento de erro
                console.error('Erro ao enviar imagem para a API:', error);
            }
        } else {
            console.warn('Nenhuma imagem capturada para enviar.');
        }
    };


    return (
        <View style={styles.container}>
            {showCamera && (
                <Camera style={styles.camera} type={type} ref={(ref) => setCameraRef(ref)}>
                    <View style={{ marginTop: '115%', marginRight: '16%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'row-reverse' }}>
                        <TouchableOpacity style={{ marginLeft: '4%' }} onPress={toggleCameraType}>
                            <Image source={require('../imgs/camera/girarCamera.png')} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={takePicture}>
                            <Image source={require('../imgs/camera/botaoCamera.png')} />
                        </TouchableOpacity>
                    </View>
                </Camera>
            )}
            {capturedImage && confirmar && (
                <View style={styles.container}>
                    <Text>Imagem</Text>
                    <Image source={{ uri: capturedImage.uri }} style={styles.image} resizeMode="contain" />
                    <Button title="Tirar Outra" onPress={retakePicture} />
                    <Button title="Aceitar" onPress={aceitar} />
                </View>
            )}
            {userLocation && !showCamera && !confirmar && (
                <MapView
                    style={{ width: 400, height: 400 }}
                    region={{
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                        latitudeDelta: 0.006,
                        longitudeDelta: 0.006,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: userLocation.latitude,
                            longitude: userLocation.longitude
                        }}
                        title="Sua localização"
                    />
                </MapView>
            )}
            {userLocation && !showCamera && !confirmar && (
                <View style={{ alignItems: 'center', display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%', flexDirection: 'row', marginTop: 20 }}>
                    <Button title="Enviar" onPress={sendPictureToAPI} />
                    <Button title="Cancelar" />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    camera: {
        flex: 1,
        width: '100%',
        aspectRatio: 1 / 1.4,
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 300,
        height: 400,
    },
});