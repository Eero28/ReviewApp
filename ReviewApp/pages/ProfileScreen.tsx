import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../ContexApi";
import { useNavigation } from "@react-navigation/native";
import ConfirmationSheet from "../components/ConfirmationsSheet";
import axios from "axios";
// @ts-expect-error: Ignore the issue with the import from @env.
import { API_URL } from "@env";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { handleLogout, userInfo, setUserInfo } = useAuth();
  if (!userInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.userName}>YOU HAVE NO POWER HERE.....</Text>
      </SafeAreaView>
    );
  }

  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);


  const toggleSheet = () => setIsOpen((prev) => !prev);
  const toggleSheet2 = () => setIsOpen2((prev) => !prev);

  const confirmLogout = () => {
    handleLogout();
    navigation.goBack();
    toggleSheet();
  };

  const changeAvatar = async (id_user?: number) => {
    console.log(id_user)
    try {
      await axios.patch(`${API_URL}/users/${id_user}/avatar`, {
        avatar:
          "https://t3.ftcdn.net/jpg/02/36/99/22/360_F_236992283_sNOxCVQeFLd5pdqaKGh8DRGMZy7P4XKm.jpg",
      });
      const response = await axios.get(`${API_URL}/users/${id_user}`);
      setUserInfo(response.data.data);
      toggleSheet2()
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>

        <TouchableOpacity onPress={toggleSheet2}>
          <Image source={{ uri: userInfo?.avatar }} style={styles.profileImage} />
        </TouchableOpacity>

        <Text style={styles.userName}>{userInfo?.username}</Text>
        <Text style={styles.userEmail}>{userInfo?.email}</Text>
        <Text style={styles.userEmail}>{userInfo?.role}</Text>
        <Text style={styles.userEmail}>3213123</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={toggleSheet}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

      </View>

      <ConfirmationSheet
        title="Are you sure you want to logout?"
        message="You will be logged out and redirected to the previous screen."
        isOpen={isOpen}
        onClose={toggleSheet}
        onCancel={toggleSheet}
        onConfirm={confirmLogout}
      />

      <ConfirmationSheet
        title="Modify!!"
        message="You will be logged out and redirected to the previous screen."
        isOpen={isOpen2}
        snapPoints={['100%', '50%']}
        onClose={toggleSheet2}
        onCancel={toggleSheet2}
        onConfirm={() => changeAvatar(userInfo.id_user)}
      />
    </SafeAreaView>
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
});

export default ProfileScreen;
