import React, { useEffect, useState } from "react";
import { View, Pressable, Text, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

interface CameraComponentProps {
  onImageCaptured: (imageUrl: string) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onImageCaptured }) => {
  const [cameraGranted, setCameraGranted] = useState<boolean | null>(null);
  const [libraryGranted, setLibraryGranted] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const camPerm = await ImagePicker.getCameraPermissionsAsync();
      const libPerm = await ImagePicker.getMediaLibraryPermissionsAsync();
      setCameraGranted(camPerm.status === "granted");
      setLibraryGranted(libPerm.status === "granted");
    })();
  }, []);

  const ensureCameraPermission = async (): Promise<boolean> => {
    if (cameraGranted) return true;
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera access is required to take photos.");
      setCameraGranted(false);
      return false;
    }
    setCameraGranted(true);
    return true;
  };

  const ensureLibraryPermission = async (): Promise<boolean> => {
    if (libraryGranted) return true;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Media library access is required.");
      setLibraryGranted(false);
      return false;
    }
    setLibraryGranted(true);
    return true;
  };

  const takePhoto = async () => {
    if (!(await ensureCameraPermission())) return;
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled && result.assets?.length) {
        onImageCaptured(result.assets[0].uri);
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Unable to open camera.");
    }
  };

  const pickFromLibrary = async () => {
    if (!(await ensureLibraryPermission())) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled && result.assets?.length) {
        onImageCaptured(result.assets[0].uri);
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Unable to open photo library.");
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={takePhoto} style={[styles.button, styles.cameraButton]}>
        <Text style={styles.buttonText}>Take Photo</Text>
      </Pressable>
      <Pressable onPress={pickFromLibrary} style={[styles.button, styles.libraryButton]}>
        <Text style={styles.buttonText}>Pick from Library</Text>
      </Pressable>
    </View>
  );
};

export default CameraComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  button: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    minWidth: 120,
  },
  cameraButton: {
    backgroundColor: "#4CAF50",
  },
  libraryButton: {
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
