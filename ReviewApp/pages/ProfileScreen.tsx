import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Pressable,
} from "react-native";
import { useAuth } from "../ContexApi";
import { useNavigation } from "@react-navigation/native";
import ConfirmationSheet from "../components/ConfirmationsSheet";
import { formatDate } from "../helpers/date";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { screenWidth } from "../helpers/dimensions";
import * as ImagePicker from "expo-image-picker";
import { errorHandler } from '../helpers/errors/error';
import axios from "axios";
import { API_URL } from "@env";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../Navigation/DrawerNavigation';

const profileSize = screenWidth * 0.3;
type FavoritesNavProp = DrawerNavigationProp<DrawerParamList, 'Favorites'>;

const ProfileScreen = () => {

  const navigation = useNavigation<FavoritesNavProp>();
  const { handleLogout, userInfo, setUserInfo, userReviews, setReviewsUpdated, reviewsUpdated } = useAuth();

  if (!userInfo) {
    handleLogout();
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.userName}>YOU HAVE NO POWER HERE.....</Text>
      </SafeAreaView>
    );
  }

  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);


  const toggleSheetLogout = () => {
    setIsOpen((prev) => !prev);
    if (isOpen2) {
      toggleSheet2()
    }
  }
  const toggleSheet2 = () => setIsOpen2((prev) => !prev);


  const confirmLogout = () => {
    handleLogout();
    navigation.goBack();
    toggleSheetLogout();
  };

  const stats = [
    { label: "Review Count", value: userReviews.length },
    { label: "Reviews Liked", value: 85 },
    { label: "Review Commented", value: 42 },
  ];

  // update avatar
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isOpen3, setIsOpen3] = useState(false);
  const toggleSheet3 = () => {
    setIsOpen3((prev) => !prev);
  }

  const updateAvatar = async (uri: string) => {
    try {
      const formData = new FormData();
      formData.append("avatar", {
        uri,
        name: "avatar.jpg",
        type: "image/jpeg",
      } as any);

      console.log("id user", userInfo.id_user)

      const response = await axios.patch(
        `${API_URL}/users/avatar/${userInfo?.id_user}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updatedUser = response.data.data;

      setImageUri(updatedUser.avatar);
      if (userInfo) {
        // remember to update asyncstorage or it wont update the user!
        const newUserInfo = { ...userInfo, avatar: updatedUser.avatar };
        setUserInfo(newUserInfo);
        await AsyncStorage.setItem('userInfo', JSON.stringify(newUserInfo));
        console.log("userinfo updated", newUserInfo)
      }
      setReviewsUpdated(!reviewsUpdated);
    } catch (error) {
      errorHandler(error);
    }
  };



  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access gallery is required!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      toggleSheet3();
    }

  };

  const goToFavoritesPage = () => {
    navigation.navigate('Favorites');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={{
            uri: "https://media.gettyimages.com/id/1469875556/video/4k-abstract-lines-background-loopable.jpg?s=640x640&k=20&c=oRhmLOFm1rQPZQSQrUqnd8eRd8LsoGLmiQS7nMIh-MU=",
          }}
          style={styles.backgroundAvatar}
        />

        <View style={styles.settingsContainer}>
          <Pressable style={styles.categoryBadge} onPress={toggleSheet2}>
            <FontAwesome name="gears" size={24} color="black" />
          </Pressable>
          {isOpen2 && (
            <View style={styles.dropDownMenu}>
              <Pressable onPress={toggleSheetLogout}>
                <Text style={styles.dropDownMenuText}>Logout</Text>
              </Pressable>
              <Pressable onPress={toggleSheet3}>
                <Text style={styles.dropDownMenuText}>Update profile</Text>
              </Pressable>
              <Pressable onPress={goToFavoritesPage}>
                <Text style={styles.dropDownMenuText}>Favorites</Text>
              </Pressable>
            </View>
          )}
        </View>
        <Pressable onPress={pickImage}>
          <Image source={{ uri: imageUri || userInfo.avatar }} style={styles.profileImage} />
        </Pressable>
      </View>

      <View style={styles.userInfoContainer}>
        <Text style={styles.userName}>{userInfo.username}</Text>
        <Text style={userInfo.role === "user" ? styles.userRole : styles.userRoleAdmin}>
          {userInfo.role}
        </Text>
      </View>

      <Text style={styles.memberSince}>
        Member since {formatDate(userInfo.createdAt)}
      </Text>

      <View style={styles.emailContainer}>
        <MaterialCommunityIcons name="email-outline" size={24} color="gray" />
        <Text style={styles.userEmail}>{userInfo.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((item, index) => (
          <View key={index} style={styles.statsBox}>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      <ConfirmationSheet
        title="Update your profile image?"
        message="Are you sure you want to upload this image?"
        isOpen={isOpen3}
        onClose={toggleSheet3}
        onCancel={toggleSheet3}
        onConfirm={() => {
          if (imageUri) updateAvatar(imageUri);
          toggleSheet3();
        }}
      />


      <ConfirmationSheet
        title="Are you sure you want to logout?"
        message="You will be logged out and redirected to the login/register screen."
        isOpen={isOpen}
        onClose={toggleSheetLogout}
        onCancel={toggleSheetLogout}
        onConfirm={confirmLogout}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    width: "100%",
    height: profileSize * 2,
    position: "relative",
    justifyContent: "flex-end",
  },
  backgroundAvatar: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  profileImage: {
    width: profileSize,
    height: profileSize,
    borderRadius: profileSize / 2,
    borderWidth: 4,
    borderColor: "#ddd",
    position: "absolute",
    bottom: -profileSize / 2,
    left: 15,
  },
  settingsContainer: {
    position: "absolute",
    top: 15,
    right: 15,
    alignItems: "flex-end",
  },
  categoryBadge: {
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  dropDownMenu: {
    marginTop: 8,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    elevation: 5,
    minWidth: screenWidth * 0.35,
    maxWidth: screenWidth * 0.6,
  },
  dropDownMenuText: {
    paddingVertical: 6,
    textAlign: "left",
    fontSize: 16,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    marginTop: profileSize / 2 + 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 10,
  },
  userRole: {
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "green",
    backgroundColor: "white",
    color: "green",
    fontSize: 14,
  },
  userRoleAdmin: {
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "blue",
    backgroundColor: "blue",
    color: "white",
    fontSize: 14,
  },
  memberSince: {
    paddingHorizontal: 15,
    marginTop: 8,
    marginBottom: 10,
    fontSize: 14,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  userEmail: {
    color: "#888",
    marginLeft: 8,
    flexShrink: 1,
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  statsBox: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 6,
  },
  logoutButton: {
    backgroundColor: "#ff4c4c",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
    alignSelf: "center",
  },
  logoutButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});

export default ProfileScreen;
