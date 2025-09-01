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

const profileSize = screenWidth * 0.3;

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { handleLogout, userInfo, userReviews } = useAuth();

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
              <Pressable>
                <Text style={styles.dropDownMenuText}>Update profile</Text>
              </Pressable>
              <Pressable>
                <Text style={styles.dropDownMenuText}>Favorites</Text>
              </Pressable>
            </View>
          )}
        </View>

        <Image source={{ uri: userInfo.avatar }} style={styles.profileImage} />
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
