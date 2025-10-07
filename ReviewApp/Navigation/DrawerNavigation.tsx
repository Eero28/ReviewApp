import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabNavigator from "./BottomTabNavigator";
import ProfileScreen from "../pages/ProfileScreen";
import Favorites from "../pages/Favorites";
import { useAuth } from "../providers/ContexApi";
import { useTheme } from "../providers/ThemeContext";
import { useSearch } from "../providers/SearchBarContext";
import { DrawerParamList } from "../interfaces/Navigation";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = () => {
  const { toggleSearchBar, isOpen } = useSearch();
  const { userInfo } = useAuth();
  const { colors, fonts } = useTheme();

  const renderHeaderRight = () => {
    if (!userInfo) return null;

    return isOpen ? (
      <AntDesign
        style={{ marginRight: 10 }}
        onPress={toggleSearchBar}
        name="close"
        size={24}
        color={colors.textColorSecondary}
      />
    ) : (
      <FontAwesome5
        style={{ marginRight: 10 }}
        onPress={toggleSearchBar}
        name="search"
        size={26}
        color={colors.textColorSecondary}
      />
    );
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { backgroundColor: colors.bg },
        drawerActiveTintColor: colors.textColorPrimary,
        drawerInactiveTintColor: colors.textColorSecondary,
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.textColorPrimary,
        headerTitleStyle: { fontFamily: fonts.regular },
      }}
    >
      <Drawer.Screen
        name={userInfo ? "Reviews" : "Welcome"}
        component={BottomTabNavigator}
        initialParams={{ screen: "Myreviews", params: { openSearch: false } }}
        options={{
          headerShown: true,
          headerRight: renderHeaderRight,
          drawerIcon: ({ color }) => <MaterialIcons name="home" size={20} color={color} />,
        }}
      />

      {userInfo && (
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            drawerIcon: ({ color }) => <MaterialIcons name="account-circle" size={20} color={color} />,
          }}
        />
      )}

      {userInfo && (
        <Drawer.Screen
          name="Favorites"
          component={Favorites}
          options={{
            headerRight: renderHeaderRight,
            drawerIcon: ({ color }) => <Ionicons name="heart" size={20} color={color} />,
          }}
        />
      )}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
