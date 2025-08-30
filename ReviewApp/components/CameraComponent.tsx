import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect, useNavigation, NavigationProp } from '@react-navigation/native';

interface CameraComponentProps {
  onImageCaptured: (imageUrl: string) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onImageCaptured }) => {
  const navigation = useNavigation<NavigationProp<any>>();

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
      navigation.goBack();
    } else {
      handleImageSelection(result);
    }
  };

  const handleImageSelection = (result: ImagePicker.ImagePickerResult) => {
    if (result.assets && result.assets.length > 0) {
      const imageUrl = result.assets[0].uri;
      onImageCaptured(imageUrl);
    } else {
      Alert.alert('No Image Selected', 'Please select an image.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      const openCameraIfAllowed = async () => {
        if (await requestPermissions()) {
          openCamera();
        }
      };
      openCameraIfAllowed();
    }, [])
  );

  return null;
};

export default CameraComponent;
