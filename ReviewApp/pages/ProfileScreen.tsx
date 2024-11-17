import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../ContexApi";
import { useNavigation } from "@react-navigation/native";


const ProfileScreen = () => {
  const navigation = useNavigation();
  const { handleLogout } = useAuth();

  const confirmLogout = () => {
    handleLogout();
    navigation.goBack();
  };


  return (
    <View style={styles.container}>
      <Text>ProfileScreen</Text>
      <Button onPress={confirmLogout} title="Logout" />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
