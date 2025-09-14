import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabNavigator from "./BottomTabNavigator";
import ProfileScreen from "../pages/ProfileScreen";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../providers/ContexApi";
import Favorites from "../pages/Favorites";
import { useTheme } from "../providers/ThemeContext"
import { DrawerParamList } from '../interfaces/navigation'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useSearch } from "../providers/SearchBarContext";

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator = () => {
  const { toggleSearchBar, isOpen } = useSearch()
  const { userInfo } = useAuth();
  const { colors, fonts } = useTheme();


  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: colors.bg,
        },
        drawerActiveTintColor: colors.textColorPrimary,
        drawerInactiveTintColor: colors.textColorSecondary,
        headerStyle: {
          backgroundColor: colors.bg,
        },
        headerTintColor: colors.textColorPrimary,
        headerTitleStyle: {
          fontFamily: fonts.regular,
        },
      }}
    >
      <Drawer.Screen
        name={userInfo?.username ? "Reviews" : "Welcome"}
        component={BottomTabNavigator}
        initialParams={{ screen: "Myreviews", params: { openSearch: false } }}
        options={{
          headerShown: true,
          headerRight: () => (<AntDesign style={{ marginRight: 10 }} onPress={toggleSearchBar} name={!isOpen ? 'search1' : 'close'} size={26} color={colors.textColorPrimary} />),
          drawerIcon: ({ color }) => (
            <MaterialIcons name="home" size={20} color={color} />
          ),
        }}
      />
      {userInfo && (
        <Drawer.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            drawerIcon: ({ color }) => (
              <MaterialIcons name="account-circle" size={20} color={color} />
            ),
          }}
        />
      )}
      {userInfo && (
        <Drawer.Screen
          name="Favorites"
          component={Favorites}
          options={{
            drawerIcon: ({ color }) => (
              <Ionicons name="heart" size={20} color={color} />
            ),
          }}
        />
      )}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
