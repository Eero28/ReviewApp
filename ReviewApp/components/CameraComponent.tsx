import React, { useState, useCallback } from 'react';
import { Image, Alert, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';

const CameraComponent = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const requestPermissions = async () => {
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
            Alert.alert('Permissions Denied', 'Camera and media library access is required.');
            return false;
        }
        return true;
    };

    const openCamera = async () => {
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            aspect: [4, 3],
        });

        // Check if the result was canceled
        if (result.canceled) {
            console.log('Camera was canceled');
        } else {
            handleImageSelection(result);
        }
    };

    const handleImageSelection = (result: ImagePicker.ImagePickerResult) => {
        if (result.assets && result.assets.length > 0) {
            setSelectedImage(result.assets[0].uri);
        } else {
            Alert.alert('No Image Selected', 'Please select an image.');
        }
    };

    useFocusEffect(
        useCallback(() => {
            const openCameraImmediately = async () => {
                if (await requestPermissions()) {
                    openCamera();
                }
            };
            openCameraImmediately();
        }, [])
    );

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightgray' }}>
            {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200 }} resizeMode="contain" />}
        </SafeAreaView>
    );
};

export default CameraComponent;
