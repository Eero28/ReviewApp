import React, { useState, useCallback } from 'react';
import { Alert, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';

interface CameraComponentProps {
  navigation: NavigationProp<any>;
  onImageCaptured: (imageUrl: string) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ navigation, onImageCaptured }) => {
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
      mediaTypes: ["images"],
      quality: 1,
      aspect: [4, 3],
    });

    if (result.canceled) {
      console.log('Camera was canceled');
      navigation.goBack();
    } else {
      handleImageSelection(result);
    }
  };

  const handleImageSelection = (result: ImagePicker.ImagePickerResult) => {
    if (result.assets && result.assets.length > 0) {
      const imageUrl = result.assets[0].uri;
      setSelectedImage(imageUrl);
      onImageCaptured(imageUrl);
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
    <SafeAreaView>
    </SafeAreaView>
  );
};



export default CameraComponent;
