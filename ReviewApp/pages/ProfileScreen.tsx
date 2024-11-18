import React from "react";
import { Button, StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useAuth } from "../ContexApi";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { handleLogout, userInfo } = useAuth();

  const confirmLogout = () => {
    handleLogout();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
    
      <Image
        source={{ uri: 'https://example.com/profile-picture.jpg' }} 
        style={styles.profileImage}
      />
      <Text style={styles.userName}>{userInfo?.username}</Text>
      <Text style={styles.userEmail}>{userInfo?.email}</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 4,
    borderColor: "#ddd",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: "#ff4c4c",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 15,
  },
  logoutButtonText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  editProfileText: {
    fontSize: 16,
    color: "#0066cc",
    textDecorationLine: "underline",
  },
});
