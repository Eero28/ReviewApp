import { FC } from "react";
import LoginScreen from "../pages/LoginScreen";
import RegisterScreen from "../pages/RegisterScreen";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "../providers/ThemeContext";

const Tab = createBottomTabNavigator();

const AuthTabs: FC = () => {
  const { colors, fonts, fontSizes } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.textColorPrimary,
        tabBarStyle: { backgroundColor: colors.card.bg },
        tabBarActiveTintColor: colors.textColorPrimary,
        tabBarInactiveTintColor: colors.textColorSecondary,
        headerTitleStyle: {
          fontFamily: fonts.bold,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.medium,
          fontSize: fontSizes.xs,
        },
      }}
    >
      <Tab.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="login" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="app-registration" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AuthTabs;
