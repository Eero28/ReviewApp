import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useAuth } from "../ContexApi";
import { useNavigation } from "@react-navigation/native";
import BottomSheetScrollView from "../components/BottomSheetScrollView";


const ProfileScreen = () => {
  const navigation = useNavigation();
  const { handleLogout, userInfo } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const toggleSheet = () => {
    setIsOpen(!isOpen); 
  };

  const confirmLogout = () => {
    handleLogout();
    navigation.goBack();
    toggleSheet(); 
  };

  const cancelLogout = () => {
    toggleSheet();
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" }}
        style={styles.profileImage}
      />
      <Text style={styles.userName}>{userInfo?.username}</Text>
      <Text style={styles.userEmail}>{userInfo?.email}</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={toggleSheet}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <BottomSheetScrollView
      isOpen={isOpen}
      backgroundColor="#111213"
      onClose={toggleSheet}
      snapPoints={['40%','30%']}
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Are you sure you want to logout?</Text>
          <Text style={styles.sheetText}>
            You will be logged out and redirected to the previous screen.
          </Text>
          <View style={styles.sheetActions}>
            <TouchableOpacity
              style={[styles.sheetButton, styles.cancelButton]}
              onPress={cancelLogout}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sheetButton, styles.confirmButton]}
              onPress={confirmLogout}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
        </BottomSheetScrollView>
    </View>
  );
};

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
  sheetContent: {
    padding: 20,
    alignItems: "center",
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sheetText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  sheetActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  sheetButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    width: "40%",
  },
  cancelButton: {
    backgroundColor: "#ddd",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#333",
    textAlign:'center'
  },
  confirmButton: {
    backgroundColor: "#ff4c4c",
  },
  confirmButtonText: {
    fontSize: 16,
    color: "#fff",
    textAlign:'center'
  },
});

export default ProfileScreen;
