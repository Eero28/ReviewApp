import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from "../providers/ContexApi";
import { useTheme } from "../providers/ThemeContext";
import ConfirmationSheet from "../components/ConfirmationsSheet";
import { screenWidth } from "../helpers/dimensions";
import { formatDate } from "../helpers/date";
import { errorHandler } from "../helpers/errors/error";
import { API_URL } from "@env";
import { DrawerParamList } from "../interfaces/navigation";
import ToggleThemeButton from "../components/ToggleThemeButton";
import BottomSheetScrollView from "../components/BottomSheetScrollView";
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const profileSize = screenWidth * 0.3;

export interface ProfileNavigationProp
  extends DrawerNavigationProp<DrawerParamList, "Favorites"> { }

const ProfileScreen = () => {
  const navigation = useNavigation<ProfileNavigationProp>();

  const { colors, fonts } = useTheme();
  const {
    handleLogout,
    userInfo,
    setUserInfo,
    userReviews,
    setReviewsUpdated,
    reviewsUpdated,
  } = useAuth();

  const [isLogoutSheetOpen, setLogoutSheetOpen] = useState(false);
  const [isProfileUpdateSheetOpen, setProfileUpdateSheetOpen] = useState(false);
  const [isSettingsSheetOpen, setSettingsSheetOpen] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSelected, setIsSelected] = useState<boolean>(false)

  if (!userInfo) {
    handleLogout();
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        <Text style={[styles.userName, { color: colors.textColorPrimary }]}>
          YOU HAVE NO POWER HERE.....
        </Text>
      </SafeAreaView>
    );
  }

  // close all modals when navigating out from profile
  useEffect(() => {
    const allModalsDown = navigation.addListener("blur", () => {
      setLogoutSheetOpen(false);
      setProfileUpdateSheetOpen(false);
      setSettingsSheetOpen(false);
    });

    return allModalsDown;
  }, [navigation]);

  const toggleLogoutSheet = () => {
    setLogoutSheetOpen(prev => !prev);
    if (isSettingsSheetOpen) {
      toggleSettingsSheet()
    };
  };
  const toggleProfileUpdateSheet = () => {
    setProfileUpdateSheetOpen(prev => !prev);
    if (isSettingsSheetOpen) {
      toggleSettingsSheet()
    }
  }
  const toggleSettingsSheet = () => {
    setSettingsSheetOpen(prev => !prev);
  }

  const confirmLogout = () => {
    handleLogout();
    toggleLogoutSheet();
    navigation.goBack();
  };

  const stats = [
    { label: "Review Count", value: userReviews.length },
    { label: "Reviews Liked", value: 85 },
    { label: "Review Commented", value: 42 },
  ];

  const updateAvatar = async (uri: string) => {
    try {
      const formData = new FormData();
      formData.append("avatar", { uri, name: "avatar.jpg", type: "image/jpeg" } as any);

      const response = await axios.patch(
        `${API_URL}/users/avatar/${userInfo.id_user}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updatedUser = response.data.data;
      setImageUri(updatedUser.avatar);
      const newUserInfo = { ...userInfo, avatar: updatedUser.avatar };
      setUserInfo(newUserInfo);
      await AsyncStorage.setItem("userInfo", JSON.stringify(newUserInfo));
      setReviewsUpdated(!reviewsUpdated);
    } catch (error) {
      errorHandler(error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return alert("Permission to access gallery is required!");
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 1 });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      toggleProfileUpdateSheet();
    }
  };

  const handleAvatarUpdate = () => {
    if (imageUri) {
      updateAvatar(imageUri);
      toggleProfileUpdateSheet();
    }
  }

  const handleUpdateCancel = () => {
    setImageUri(userInfo.avatar)
    toggleProfileUpdateSheet()
  }

  const goToFavoritesPage = () => {
    navigation.navigate("Favorites");
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['bottom', 'left', 'right']}>
      <View style={styles.headerContainer}>
        <Image
          source={{
            uri: "https://media.gettyimages.com/id/1469875556/video/4k-abstract-lines-background-loopable.jpg?s=640x640&k=20&c=oRhmLOFm1rQPZQSQrUqnd8eRd8LsoGLmiQS7nMIh-MU=",
          }}
          style={styles.backgroundAvatar}
        />

        <View style={styles.settingsContainer}>
          <Pressable
            style={[styles.categoryBadge, { backgroundColor: colors.bg }]}
            onPress={toggleSettingsSheet}
          >
            <FontAwesome name="gears" size={24} color={colors.textColorSecondary} />
          </Pressable>
        </View>

        <Pressable>
          <Image source={{ uri: imageUri || userInfo.avatar }} style={styles.profileImage} />
        </Pressable>
      </View>

      <View style={styles.userInfoContainer}>
        <Text style={[styles.userName, { color: colors.textColorPrimary, fontFamily: fonts.bold }]}>
          {userInfo.username}
        </Text>
        <Text
          style={[
            userInfo.role === "user"
              ? { ...styles.userRole, color: "green", borderColor: "green", backgroundColor: colors.bg }
              : { ...styles.userRoleAdmin, color: colors.bg, borderColor: "blue", backgroundColor: "blue" },
            { fontFamily: fonts.medium },
          ]}
        >
          {userInfo.role}
        </Text>
      </View>

      <Text style={[styles.memberSince, { color: colors.textColorSecondary, fontFamily: fonts.regular }]}>
        Member since {formatDate(userInfo.createdAt)}
      </Text>

      <View style={styles.emailContainer}>
        <MaterialCommunityIcons name="email-outline" size={24} color={colors.textColorSecondary} />
        <Text style={[styles.userEmail, { color: colors.textColorSecondary, fontFamily: fonts.regular }]}>
          {userInfo.email}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((item, index) => (
          <View key={index} style={[styles.statsBox, { backgroundColor: colors.card.bg }]}>
            <Text style={[styles.statValue, { color: colors.textColorPrimary, fontFamily: fonts.bold }]}>
              {item.value}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textColorSecondary, fontFamily: fonts.medium }]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
      <BottomSheetScrollView
        onClose={toggleSettingsSheet}
        isOpen={isSettingsSheetOpen}
        snapPoints={['90%', '70%']}
      >
        <View style={[styles.settingsContainerSheet, { backgroundColor: colors.modalDialog.bg }]}>

          <Text style={[styles.settingsTitle, { color: colors.textColorPrimary, fontFamily: fonts.bold }]}>
            Settings
          </Text>

          <View style={[styles.divider, { backgroundColor: colors.card.separator }]} />

          <Pressable style={styles.pressableSettings} onPress={toggleLogoutSheet}>
            <MaterialCommunityIcons name="logout" size={24} color={colors.textColorPrimary} />
            <Text style={[styles.settingsText, { color: colors.textColorSecondary, fontFamily: fonts.medium }]}>
              Logout
            </Text>
          </Pressable>

          <Pressable style={styles.pressableSettings} onPress={pickImage}>
            <Feather name="user" size={24} color={colors.textColorPrimary} />
            <Text style={[styles.settingsText, { color: colors.textColorSecondary, fontFamily: fonts.medium }]}>
              Update Profile Picture
            </Text>
          </Pressable>

          <Pressable style={styles.pressableSettings} onPress={goToFavoritesPage}>
            <MaterialIcons name="favorite" size={24} color={colors.textColorPrimary} />
            <Text style={[styles.settingsText, { color: colors.textColorSecondary, fontFamily: fonts.medium }]}>
              Favorites
            </Text>
          </Pressable>
          <ToggleThemeButton />
        </View>
      </BottomSheetScrollView>


      <ConfirmationSheet
        title="Update your profile image?"
        message="Are you sure you want to upload this image?"
        isOpen={isProfileUpdateSheetOpen}
        onClose={toggleProfileUpdateSheet}
        onCancel={handleUpdateCancel}
        onConfirm={handleAvatarUpdate}
      />
      <ConfirmationSheet
        title="Are you sure you want to logout?"
        message="You will be logged out and redirected to the login/register screen."
        isOpen={isLogoutSheetOpen}
        onClose={toggleLogoutSheet}
        onCancel={toggleLogoutSheet}
        onConfirm={confirmLogout}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    padding: 10,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  settingsContainerSheet: {
    padding: 10,
    justifyContent: 'flex-start',
  },
  pressableSettings: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginVertical: 6,
  },
  settingsText: {
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  settingsTitle: {
    fontSize: 22,
    marginBottom: 15,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 15,
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
    backgroundColor: "white",
    fontSize: 14,
  },
  userRoleAdmin: {
    padding: 6,
    borderRadius: 12,
    borderWidth: 1,
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
    textAlign: "center",
    marginTop: 6,
  },
});

export default ProfileScreen;
